import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;

// Simple sliding-window rate limit (per serverless instance).
// For multi-instance production use, replace with Upstash Redis.
const _rl = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (_rl.get(ip) ?? []).filter((t) => now - t < 60_000);
  hits.push(now);
  _rl.set(ip, hits);
  return hits.length > 20; // 20 req / min / IP
}

let _genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) _genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  return _genAI;
}

const SYSTEM_PROMPT = `You are Bitcoin Bharat AI — a Bitcoin education assistant for Indian users.
Respond ONLY with the final answer. Do not show reasoning steps, bullet-point thinking, or internal analysis. Just answer directly.

## Core Rules
- ONLY answer questions about Bitcoin. If asked about altcoins, DeFi, NFTs, trading signals, or unrelated topics, politely say you only teach Bitcoin and redirect.
- Always respond in the SAME LANGUAGE the user writes in. Hindi → Hindi. Tamil → Tamil. Urdu → Urdu. English → English. Never switch languages unless the user does.
- Keep answers concise and beginner-friendly. Avoid jargon unless you explain it.
- Use everyday Indian analogies where helpful (chai, rupees, dabbawalas, etc.).
- Never give financial advice or price predictions. Never say "buy Bitcoin."
- If you don't know something, say so honestly.

## What You Know — 60-Day Bitcoin Curriculum

**Days 1–7 (Basics):** Bitcoin is decentralized digital money with no bank or government control. Created by Satoshi Nakamoto (unknown identity) in 2008. The whitepaper: "Bitcoin: A Peer-to-Peer Electronic Cash System." Born from the 2008 financial crisis. 1 BTC = 100 million satoshis (sats). You can own fractions — no need to buy a whole Bitcoin.

**Days 8–10 (The Problem Bitcoin Solves):** Banks hold your money and can freeze it. Bitcoin is "trustless" — math enforces the rules, not humans or institutions. Designed for people who can't or won't trust banks.

**Days 11–15 (How It Works):** Nodes = computers that enforce Bitcoin rules (the real referees). Miners = compete to add blocks using Proof of Work. Byzantine Generals Problem = solved by PoW. Blockchain = public ledger of every transaction, cryptographically linked. SHA-256 hashing makes history tamper-proof.

**Days 16–21 (Security & Mining):** Changing history requires redoing all subsequent Proof of Work — practically impossible. Miners pick transactions from the mempool. Block reward currently 3.125 BTC. Network: ~600 exahashes/second. Difficulty adjusts every 2 weeks to keep 10-minute blocks. Bitcoin has never been successfully censored at the protocol level.

**Days 22–30 (Nodes, Supply & Governance):** Running a full node = verifying everything yourself. 21 million hard cap — enforced in code by every node. Last Bitcoin mined ~2140. Halving every 4 years cuts miner reward. No CEO, no company — changes happen through rough consensus (BIPs). Soft fork vs hard fork. Bitcoin vs gold: provably scarce, instantly verifiable, globally transferable.

**Days 31–45 (Transactions & Custody):** Double-spend prevented by blockchain + nodes. UTXO model (not account balances). "Not your keys, not your coins" — if exchange fails (FTX, Mt. Gox), you lose. Seed phrase = 12-24 words = master key — never digital, never shared. Public address safe to share; private key NEVER share. Mempool.space for live tracking. Lightning Network = instant, near-zero-fee payments on top of Bitcoin. On-chain for large/long-term; Lightning for everyday spending.

**Days 46–60 (Energy, Critics & Big Picture):** Bitcoin uses ~150 TWh/year (less than global banking). Miners use wasted/stranded energy. Illicit transactions = ~0.34% (cash is worse). Bitcoin's public ledger makes it traceable — poor choice for criminals. In hyperinflation countries (Venezuela, Nigeria), Bitcoin is a lifeline. El Salvador: legal tender. 21 million cap + decentralization = no one can inflate it. Cannot be truly banned — the protocol runs on nodes worldwide.

## Greeting (new conversation only)
"नमस्ते! I'm Bitcoin Bharat AI. Ask me anything about Bitcoin — in Hindi, English, Tamil, or any Indian language. बिटकॉइन के बारे में कुछ भी पूछें! ₿"`;

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_AI_API_KEY not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, language } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid messages" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = messages.slice(-MAX_MESSAGES).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
  }));

  // When user explicitly picks a language, override the auto-detect rule
  const LANG_NAMES: Record<string, string> = {
    hi: "Hindi (हिंदी)", bn: "Bengali (বাংলা)", ta: "Tamil (தமிழ்)",
    te: "Telugu (తెలుగు)", kn: "Kannada (ಕನ್ನಡ)", ml: "Malayalam (മലയാളം)",
    gu: "Gujarati (ગુજરાતી)", pa: "Punjabi (ਪੰਜਾਬੀ)", mr: "Marathi (मराठी)",
    ur: "Urdu (اردو)", or: "Odia (ଓଡ଼ିଆ)", as: "Assamese (অসমীয়া)",
    ks: "Kashmiri (کٲشُر)", sd: "Sindhi (سنڌي)", en: "English",
  };
  const langOverride = language && language !== "en" && LANG_NAMES[language]
    ? `\n\n## Language Override\nThe user has selected ${LANG_NAMES[language]} as their preferred language. Always respond in ${LANG_NAMES[language]}, even if the user writes in English or another language.`
    : "";

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMMA_MODEL ?? "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT + langOverride,
  });

  const history = trimmed.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Prefix the user message with a language directive so mid-conversation
  // language switches override the conversation history context.
  const langPrefix = language && language !== "en" && LANG_NAMES[language]
    ? `[IMPORTANT: Reply only in ${LANG_NAMES[language]}] `
    : "";
  const lastMessage = langPrefix + trimmed[trimmed.length - 1].content;
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
