"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Lightweight markdown renderer (avoids ESM-only react-markdown) ────────────
function Markdown({ children }: { children: string }) {
  const lines = children.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") { i++; continue; }

    // Unordered list block
    if (/^[-*] /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(<li key={i}>{inline(lines[i].replace(/^[-*] /, ""))}</li>);
        i++;
      }
      out.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    // Ordered list block
    if (/^\d+\. /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(<li key={i}>{inline(lines[i].replace(/^\d+\. /, ""))}</li>);
        i++;
      }
      out.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    // Heading
    const hm = line.match(/^(#{1,3}) (.+)/);
    if (hm) {
      const level = hm[1].length as 1 | 2 | 3;
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      out.push(<Tag key={i}>{inline(hm[2])}</Tag>);
      i++; continue;
    }

    // Paragraph
    out.push(<p key={i}>{inline(line)}</p>);
    i++;
  }
  return <>{out}</>;
}

function inline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Match **bold**, *italic*, `code` in order
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0, m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={idx++}>{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={idx++}>{m[3]}</em>);
    else if (m[4]) parts.push(<code key={idx++}>{m[4]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type VideoCard = { day: number; title: string; url: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  video?: VideoCard | null;
  isError?: boolean;
};

// ── Language detection ────────────────────────────────────────────────────────
const SCRIPT_MAP: { range: [number, number]; code: string }[] = [
  { range: [0x0900, 0x097f], code: "hi" },  // Devanagari → Hindi/Marathi
  { range: [0x0980, 0x09ff], code: "bn" },  // Bengali
  { range: [0x0a00, 0x0a7f], code: "pa" },  // Gurmukhi → Punjabi
  { range: [0x0a80, 0x0aff], code: "gu" },  // Gujarati
  { range: [0x0b00, 0x0b7f], code: "or" },  // Odia
  { range: [0x0b80, 0x0bff], code: "ta" },  // Tamil
  { range: [0x0c00, 0x0c7f], code: "te" },  // Telugu
  { range: [0x0c80, 0x0cff], code: "kn" },  // Kannada
  { range: [0x0d00, 0x0d7f], code: "ml" },  // Malayalam
  { range: [0x0600, 0x06ff], code: "ur" },  // Arabic → Urdu/Sindhi/Kashmiri
];

function detectLang(text: string): string | null {
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    for (const { range, code } of SCRIPT_MAP) {
      if (cp >= range[0] && cp <= range[1]) return code;
    }
  }
  return null;
}

// ── RTL languages ─────────────────────────────────────────────────────────────
const RTL_LANGS = new Set(["ur", "ks", "sd"]);

// ── Voice input language codes ────────────────────────────────────────────────
const VOICE_LANG: Record<string, string> = {
  hi: "hi-IN", bn: "bn-BD", ta: "ta-IN", te: "te-IN",
  kn: "kn-IN", ml: "ml-IN", gu: "gu-IN", pa: "pa-IN",
  mr: "mr-IN", ur: "ur-PK", en: "en-IN", or: "or-IN",
  as: "as-IN", ks: "ur-PK", sd: "ur-PK",
};

// ── Video map ─────────────────────────────────────────────────────────────────
const LANG_PAGE: Record<string, string> = {
  hi: "https://bhartiyabitcoin.com/languages/hindi/",
  ta: "https://bhartiyabitcoin.com/languages/tamil/",
  te: "https://bhartiyabitcoin.com/languages/telugu/",
  kn: "https://bhartiyabitcoin.com/languages/kannada/",
  ml: "https://bhartiyabitcoin.com/languages/malayalam/",
  gu: "https://bhartiyabitcoin.com/languages/gujarati/",
  pa: "https://bhartiyabitcoin.com/languages/punjabi/",
  mr: "https://bhartiyabitcoin.com/languages/marathi/",
  ur: "https://bhartiyabitcoin.com/languages/urdu/",
  or: "https://bhartiyabitcoin.com/languages/odia/",
  as: "https://bhartiyabitcoin.com/languages/assamese/",
  ks: "https://bhartiyabitcoin.com/languages/kashmiri/",
  sd: "https://bhartiyabitcoin.com/languages/sindhi/",
  en: "https://bhartiyabitcoin.com/languages/hindi/",
};

// Localized "Watch in X" label per language
const LANG_WATCH: Record<string, string> = {
  en: "Watch in English →",
  hi: "हिंदी में देखें →",
  ta: "தமிழில் பார்க்கவும் →",
  te: "తెలుగులో చూడండి →",
  kn: "ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ →",
  ml: "മലയാളത്തിൽ കാണൂ →",
  gu: "ગુજરાતીમાં જુઓ →",
  pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਦੇਖੋ →",
  mr: "मराठीत पहा →",
  bn: "বাংলায় দেখুন →",
  ur: "اردو میں دیکھیں →",
  or: "ଓଡ଼ିଆରେ ଦେଖନ୍ତୁ →",
  as: "অসমীয়াত চাওক →",
  ks: "کٲشُرِ مَنٛز وُچھِو →",
};

const VIDEOS: { day: number; title: string; keywords: string[]; url: string }[] = [
  { day: 1,  title: "What is Bitcoin?",               keywords: ["what is bitcoin","bitcoin kya","बिटकॉइन क्या है","bitcoin hai","what bitcoin"],         url: "https://rumble.com/v71ttqs-day-160-bitcoin-learn-in-hindi-language.html" },
  { day: 2,  title: "Who created Bitcoin?",            keywords: ["satoshi","nakamoto","created bitcoin","किसने बनाया","who made bitcoin"],                  url: "https://rumble.com/v71vcze-bitcoin-.html" },
  { day: 3,  title: "The Bitcoin Whitepaper",          keywords: ["whitepaper","white paper","व्हाइटपेपर"],                                                  url: "https://rumble.com/v71xlos-day-360-bitcoin-whitepaper-.html" },
  { day: 4,  title: "Why was Bitcoin created?",        keywords: ["why was bitcoin","क्यों बनाया","2008","financial crisis","bank failure"],                 url: "https://rumble.com/v71zeyu-day-460-bitcoin-.html" },
  { day: 5,  title: "Why did Satoshi disappear?",      keywords: ["satoshi disappear","गायब","why did satoshi","anonymous","अज्ञात"],                        url: "https://rumble.com/v722v5q-day-560-satoshi-.html" },
  { day: 6,  title: "Bitcoin vs bitcoin vs BTC",       keywords: ["bitcoin btc","difference between","btc vs","फ़र्क़","lowercase","uppercase"],              url: "https://rumble.com/v724ioc-day-660-bitcoin-bitcoin-btc-.html" },
  { day: 7,  title: "What are Sats?",                  keywords: ["sats","satoshi unit","satoshis","smallest","100 million","सैट"],                          url: "https://rumble.com/v7266nq-day-760-sats-.-.html" },
  { day: 8,  title: "Your money in someone else's hands?", keywords: ["bank control","your money","किसी और के हाथ","freeze account","custodian"],            url: "https://rumble.com/v727pvk-day-860-.html" },
  { day: 9,  title: "When trust breaks down",          keywords: ["trust","भरोसा","institution fail","bank run","demonetization"],                           url: "https://rumble.com/v72983u-day-960-.html" },
  { day: 10, title: "Bitcoin: The trustless system",   keywords: ["trustless","trust less","no trust","भरोसे की ज़रूरत नहीं","decentralized trust"],         url: "https://rumble.com/v72c4c6-day-1060-bitcoin-.html" },
  { day: 11, title: "Bitcoin Nodes",                   keywords: ["node","नोड","full node","referee","umpire","enforce rules"],                              url: "https://rumble.com/v72cygi-day-1160-bitcoin-nodes-umpire-.html" },
  { day: 12, title: "Miners and Proof of Work",        keywords: ["miner","mining","proof of work","pow","माइनर","प्रूफ़ ऑफ़ वर्क"],                         url: "https://rumble.com/v72du1c-day-1260-bitcoin-miners-proof-of-work-.html" },
  { day: 13, title: "The Byzantine Problem",           keywords: ["byzantine","बायज़ेंटाइन","generals problem","consensus","agreement"],                     url: "https://rumble.com/v72ethq-day-1360-byzantine-problem-.html" },
  { day: 14, title: "What is the Blockchain?",         keywords: ["blockchain","ब्लॉकचेन","chain of blocks","public ledger","distributed ledger"],           url: "https://rumble.com/v72g84y-day-1460-bitcoin-blockchain-.html" },
  { day: 15, title: "What is Hashing?",                keywords: ["hash","hashing","sha-256","हैशिंग","fingerprint","sha256"],                              url: "https://rumble.com/v72hqgm-day-1560-hashing-blockchain-.html" },
  { day: 16, title: "Why is blockchain secure?",       keywords: ["blockchain secure","secure","immutable","tamper","सिक्योर","why secure"],                 url: "https://rumble.com/v72ja9a-day-1660-blockchain-secure-.html" },
  { day: 17, title: "Who adds transactions?",          keywords: ["add transaction","ट्रांज़ैक्शन","transaction added","mempool","who confirms"],             url: "https://rumble.com/v72l6k0-day-1760-blockchain-transactions-add-.html" },
  { day: 18, title: "Why do miners compete?",          keywords: ["miners compete","compete","race","block reward","win block","कम्पीट"],                    url: "https://rumble.com/v72mics-day-1860-miners-compete-.html" },
  { day: 19, title: "Bitcoin's censorship resistance", keywords: ["censorship","censor","सेंसरशिप","censorship resistant","permissionless"],                 url: "https://rumble.com/v72nzuq-day-1960-bitcoin-censorship-resistant-.html" },
  { day: 20, title: "Energy and Bitcoin mining",       keywords: ["energy","electricity","ऊर्जा","power","energy use","mining energy"],                      url: "https://rumble.com/v72owlg-day-2060-bitcoin-mining-energy-role-.html" },
  { day: 21, title: "How much work goes into mining?", keywords: ["exahash","hashrate","how much work","hash rate","mining difficulty"],                     url: "https://rumble.com/v72q8n2-day-2160-fun-fact-bitcoin-mining-.html" },
  { day: 22, title: "What are Bitcoin nodes?",         keywords: ["run node","running node","full node","20000 nodes","नोड क्या","what are nodes"],          url: "https://rumble.com/v72rrmq-day-2260-bitcoin-nodes-.html" },
  { day: 23, title: "Miners vs Nodes",                 keywords: ["miners vs nodes","miner vs node","difference miner node","नोड चलाएँ"],                   url: "https://rumble.com/v72tdls-day-2360-miners-vs-nodes-node-.html" },
  { day: 24, title: "Why only 21 million?",            keywords: ["21 million","2.1 crore","21m","hard cap","supply cap","सिर्फ़ 21","why 21"],              url: "https://rumble.com/v72uzty-day-2460-21-bitcoin-.html" },
  { day: 25, title: "What happens after 2140?",        keywords: ["2140","after 2140","last bitcoin","transaction fees","2140 के बाद"],                      url: "https://rumble.com/v72x3dq-day-2560-2140-.html" },
  { day: 26, title: "Can miners speed up supply?",     keywords: ["speed supply","inflate","miners inflate","सप्लाई","supply schedule"],                     url: "https://rumble.com/v72y0j6-day-2660-miners-bitcoin-supply-.html" },
  { day: 27, title: "Bitcoin vs Gold",                 keywords: ["bitcoin vs gold","gold","सोना","digital gold","store of value","btc vs gold"],            url: "https://rumble.com/v72zc7s-day-2760-bitcoin-vs-vs-.html" },
  { day: 28, title: "Who is Bitcoin's CEO?",           keywords: ["bitcoin ceo","who controls","governance","bip","who decides","कौन कंट्रोल"],              url: "https://rumble.com/v731bl8-day-2860-bitcoin-ceo-.html" },
  { day: 29, title: "Soft Fork vs Hard Fork",          keywords: ["soft fork","hard fork","fork","upgrade","segwit","फ़ोर्क"],                                url: "https://rumble.com/v7329z6-day-2960-soft-fork-vs-hard-fork-bitcoin-upgrade-.html" },
  { day: 30, title: "Who decides Bitcoin's future?",   keywords: ["future bitcoin","who decides","rough consensus","community","developers"],                url: "https://rumble.com/v733udq-day-3060-bitcoin-future-decide-.html" },
  { day: 31, title: "Can Bitcoin be spent twice?",     keywords: ["double spend","spent twice","double-spend","दो बार","spend twice"],                       url: "https://rumble.com/v7355yi-day-3160-bitcoin-.html" },
  { day: 32, title: "Token vs Ledger",                 keywords: ["token vs ledger","utxo vs account","token model","ledger model","टोकन बनाम"],            url: "https://rumble.com/v73750u-day-3260-token-vs-ledger-bank-system-bitcoin-vs-.html" },
  { day: 33, title: "Bitcoin's public ledger",         keywords: ["public ledger","public record","transparent","पब्लिक लेजर","blockchain explorer"],        url: "https://rumble.com/v7381gm-day-3360-bitcoin-public-ledger-.html" },
  { day: 34, title: "The UTXO system",                 keywords: ["utxo","unspent transaction output","utxo model","change output","how balance"],           url: "https://rumble.com/v739v2y-day-3460-bitcoin-ledger-utxo-system-.html" },
  { day: 35, title: "Not your keys, not your coins",   keywords: ["not your keys","private key","your keys","coins","कॉइन्स","key ownership"],              url: "https://rumble.com/v73b31c-day-3560-not-your-keys-not-your-coins-.html" },
  { day: 36, title: "What is a seed phrase?",          keywords: ["seed phrase","seed word","12 words","24 words","mnemonic","सीड फ़्रेज़","recovery phrase"], url: "https://rumble.com/v73coe8-day-3660-seed-phrase-.html" },
  { day: 37, title: "Why exchanges are risky",         keywords: ["exchange risky","leave on exchange","ftx","mt gox","custodial risk","एक्सचेंज"],          url: "https://rumble.com/v73e77c-day-3760-exchange-bitcoin-risky-.html" },
  { day: 38, title: "Can you be tracked by public key?", keywords: ["tracked","track","privacy","public key track","ट्रैक","surveillance"],                  url: "https://rumble.com/v73e9f8-day-3860-public-key-track-.html" },
  { day: 39, title: "What is a public address?",       keywords: ["public address","bitcoin address","receive bitcoin","पब्लिक एड्रेस","wallet address"],    url: "https://rumble.com/v73gs20-day-3960-public-addresses-.html" },
  { day: 40, title: "Where does a transaction go?",    keywords: ["where transaction","transaction go","broadcast","propagate","ट्रांज़ैक्शन कहाँ"],         url: "https://rumble.com/v73gtd2-day-4060-bitcoin-transaction-.html" },
  { day: 41, title: "Mempool.space — watch live",      keywords: ["mempool","mempool.space","pending transaction","fee rate","unconfirmed"],                 url: "https://rumble.com/v73jiii-day-4160-mempool.space-transaction-live-.html" },
  { day: 42, title: "Bitcoin's 3 goals & Layer 1",     keywords: ["layer 1","layer one","base layer","three goals","scalability trilemma","लेयर-1"],        url: "https://rumble.com/v73kxug-day-4260-bitcoin-goals-layer-1-.html" },
  { day: 43, title: "Lightning Network",               keywords: ["lightning","lightning network","instant payment","लाइटनिंग","off chain payment","ln"],    url: "https://rumble.com/v73mgd4-day-4360-lightning-network-chai-transactions-.html" },
  { day: 44, title: "On-chain vs Off-chain",           keywords: ["on-chain","off-chain","on chain","off chain","when to use","ऑन-चेन","ऑफ़-चेन"],         url: "https://rumble.com/v73ny76-day-4460-on-chain-vs-off-chain-.html" },
  { day: 45, title: "Does Bitcoin waste energy?",      keywords: ["waste energy","energy waste","carbon","environment","एनर्जी वेस्ट","green"],              url: "https://rumble.com/v73pmdg-day-4560-bitcoin-energy-waste-.html" },
  { day: 46, title: "How Bitcoin uses wasted energy",  keywords: ["wasted energy","stranded energy","flared gas","excess power","renewable","बर्बाद"],       url: "https://rumble.com/v73qz0s-day-4660-bitcoin-wasted-energy-use-.html" },
  { day: 47, title: "Bitcoin vs other industries",     keywords: ["vs industries","other industries","gold mining energy","banking energy","comparison"],    url: "https://rumble.com/v73sl6g-day-4760-bitcoin-vs-industries-.html" },
  { day: 48, title: "Bitcoin: better use of electricity", keywords: ["better use","demand response","grid","stabilizer","renewable energy","interrupt"],     url: "https://rumble.com/v73u0jw-day-4860-bitcoin-use-.html" },
  { day: 49, title: "Is Bitcoin used for crime?",      keywords: ["crime","criminal","illegal","illicit","dark web","क्राइम","0.34"],                         url: "https://rumble.com/v73vdvs-day-4960-bitcoin-crime-use-.html" },
  { day: 50, title: "Why Bitcoin is bad for criminals", keywords: ["worst option","chain analysis","chainalysis","traceable","seized","law enforcement"],    url: "https://rumble.com/v73yvnu-day-5060-criminals-bitcoin-option-.html" },
  { day: 51, title: "Crime or freedom?",               keywords: ["freedom","azaadi","आज़ादी","dissident","activist","unbanked","venezuela","nigeria"],       url: "https://rumble.com/v73zylm-day-5160-crime-ya-azaadi-bitcoin-ka-asali-role.html" },
  { day: 52, title: "Does Bitcoin have value?",        keywords: ["no value","has value","intrinsic value","worth","क्या वैल्यू","value bitcoin"],           url: "https://rumble.com/v743xw6-day-5260-bitcoin-value-.html" },
  { day: 53, title: "Does money need to be backed?",   keywords: ["backed","gold standard","fiat","rupee backed","reserve","बैक्ड","backed by"],             url: "https://rumble.com/v744v8i-day-5360-backed-.html" },
  { day: 54, title: "Is Bitcoin outdated?",            keywords: ["outdated","old technology","obsolete","replaced","पुराना","slow bitcoin"],                url: "https://rumble.com/v7472mc-day-5460-bitcoin-.html" },
  { day: 55, title: "If outdated, why still #1?",      keywords: ["number one","#1","still top","lindy","network effect","why number"],                      url: "https://rumble.com/v748r42-day-5560-bitcoin-1-.html" },
  { day: 56, title: "Other crypto: digital paper?",    keywords: ["altcoin","other crypto","ethereum","shitcoin","pre-mine","क्रिप्टो"],                     url: "https://rumble.com/v748siy-day-5660-crypto-digital-paper-.html" },
  { day: 57, title: "Can the government ban Bitcoin?", keywords: ["ban","government ban","illegal","सरकार बैन","बैन","crackdown","regulation"],              url: "https://rumble.com/v748t4u-day-5760-bitcoin-ban-.html" },
  { day: 58, title: "How do you ban a decentralized network?", keywords: ["ban network","shut down","stop bitcoin","decentralized ban","cannot ban","china ban"], url: "https://rumble.com/v74fj8u-day-5860-bitcoin-ban-network-decentralized-.html" },
  { day: 59, title: "Bitcoin in failing economies",    keywords: ["failing economy","hyperinflation","el salvador","venezuela","nigeria","economic crisis"],  url: "https://rumble.com/v74fk2u-day-5960-bitcoin-failing-economics-.html" },
  { day: 60, title: "₹1000 invested in 2013 = ?",     keywords: ["2013","1000 rupees","return","investment","price history","how much","₹1000"],            url: "https://rumble.com/v74iltw-day-6060-2013-1000-bitcoin-.......html" },
];

function findVideo(userMsg: string, aiResponse: string): typeof VIDEOS[0] | null {
  const text = (userMsg + " " + aiResponse).toLowerCase();
  for (const v of VIDEOS) {
    if (v.keywords.some((kw) => text.includes(kw))) return v;
  }
  return null;
}

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "मराठी" },
  { code: "ur", label: "اردو" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ks", label: "کٲشُر" },
];

// ── Follow-up suggestions ─────────────────────────────────────────────────────
const FOLLOWUPS: { keywords: string[]; suggestions: string[] }[] = [
  { keywords: ["what is bitcoin","bitcoin kya","बिटकॉइन क्या"],    suggestions: ["Who created Bitcoin?","What are sats?","Why only 21 million?","Bitcoin vs gold?"] },
  { keywords: ["satoshi","creator","whitepaper","किसने बनाया"],     suggestions: ["Why did Satoshi disappear?","Who controls Bitcoin now?","What is the Bitcoin whitepaper?"] },
  { keywords: ["mining","miner","proof of work","माइनर"],           suggestions: ["What are Bitcoin nodes?","How is energy used in mining?","What is the block reward?"] },
  { keywords: ["node","blockchain","ब्लॉकचेन","नोड"],              suggestions: ["What is hashing?","Why is blockchain secure?","Can I run a node?"] },
  { keywords: ["seed","private key","custody","seed phrase","सीड"], suggestions: ["What is 'not your keys, not your coins'?","What happens if I lose my seed phrase?","Why are exchanges risky?"] },
  { keywords: ["lightning","layer 2","payment","लाइटनिंग"],        suggestions: ["On-chain vs Lightning — when to use which?","What apps use Lightning?"] },
  { keywords: ["energy","electricity","environment","ऊर्जा"],       suggestions: ["Does Bitcoin waste energy?","Bitcoin vs banking energy use?","How does mining use wasted energy?"] },
  { keywords: ["ban","government","legal","सरकार"],                 suggestions: ["Can Bitcoin be shut down?","What happened when China banned Bitcoin?"] },
  { keywords: ["exchange","ftx","mt gox","एक्सचेंज"],              suggestions: ["What is self-custody?","What happened to FTX?","What is a seed phrase?"] },
  { keywords: ["21 million","supply","halving","inflation"],         suggestions: ["What happens after all Bitcoin is mined?","What is the halving?","Can Bitcoin supply be changed?"] },
];

// Language-specific default suggestions shown on empty screen
const LANG_SUGGESTIONS: Record<string, string[]> = {
  en: ["What is Bitcoin?", "Who is Satoshi Nakamoto?", "What is a seed phrase?", "Why only 21 million?"],
  hi: ["बिटकॉइन क्या है?", "सातोशी नाकामोटो कौन हैं?", "सीड फ़्रेज़ क्या है?", "सिर्फ़ 21 मिलियन ही क्यों?"],
  ta: ["Bitcoin என்றால் என்ன?", "Satoshi Nakamoto யார்?", "Seed phrase என்றால் என்ன?", "21 million மட்டும் ஏன்?"],
  te: ["Bitcoin అంటే ఏమిటి?", "Satoshi Nakamoto ఎవరు?", "Seed phrase అంటే ఏమిటి?", "21 million మాత్రమే ఎందుకు?"],
  kn: ["Bitcoin ಎಂದರೇನು?", "Satoshi Nakamoto ಯಾರು?", "Seed phrase ಎಂದರೇನು?", "21 million ಮಾತ್ರ ಏಕೆ?"],
  ml: ["Bitcoin എന്താണ്?", "Satoshi Nakamoto ആരാണ്?", "Seed phrase എന്താണ്?", "21 million മാത്രം എന്തുകൊണ്ട്?"],
  gu: ["Bitcoin શું છે?", "Satoshi Nakamoto કોણ છે?", "Seed phrase શું છે?", "21 million જ કેમ?"],
  pa: ["Bitcoin ਕੀ ਹੈ?", "Satoshi Nakamoto ਕੌਣ ਹੈ?", "Seed phrase ਕੀ ਹੈ?", "ਸਿਰਫ਼ 21 million ਕਿਉਂ?"],
  mr: ["Bitcoin म्हणजे काय?", "Satoshi Nakamoto कोण आहे?", "Seed phrase काय आहे?", "फक्त 21 million का?"],
  bn: ["Bitcoin কী?", "Satoshi Nakamoto কে?", "Seed phrase কী?", "শুধু 21 million কেন?"],
  ur: ["Bitcoin کیا ہے؟", "Satoshi Nakamoto کون ہیں؟", "Seed phrase کیا ہے؟", "صرف 21 million کیوں؟"],
  or: ["Bitcoin କ'ଣ?", "Satoshi Nakamoto କିଏ?", "Seed phrase କ'ଣ?", "21 million କାହିଁକି?"],
  as: ["Bitcoin কি?", "Satoshi Nakamoto কোন?", "Seed phrase কি?", "মাত্ৰ 21 million কিয়?"],
  ks: ["Bitcoin کیا چھُ؟", "Satoshi Nakamoto کُس چھُ؟", "Seed phrase کیا چھُ؟", "21 million کیازِ؟"],
};

const LANG_GREETING: Record<string, string> = {
  en: "Hello! Ask me anything about Bitcoin.",
  hi: "नमस्ते! बिटकॉइन के बारे में कुछ भी पूछें।",
  ta: "வணக்கம்! Bitcoin பற்றி எதுவும் கேளுங்கள்।",
  te: "నమస్కారం! Bitcoin గురించి ఏదైనా అడగండి।",
  kn: "ನಮಸ್ಕಾರ! Bitcoin ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ।",
  ml: "നമസ്കാരം! Bitcoin നെ കുറിച്ച് എന്തും ചോദിക്കൂ.",
  gu: "નમસ્તે! Bitcoin વિશે કંઈ પણ પૂછો.",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! Bitcoin ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
  mr: "नमस्कार! Bitcoin बद्दल काहीही विचारा.",
  bn: "নমস্কার! Bitcoin সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন।",
  ur: "السلام علیکم! Bitcoin کے بارے میں کچھ بھی پوچھیں۔",
  or: "ନମସ୍କାର! Bitcoin ବିଷୟରେ ଯୁ ବି ପଚାରନ୍ତୁ।",
  as: "নমস্কাৰ! Bitcoin বিষয়ে যিকোনো কথা সোধক।",
  ks: "آداب! Bitcoin بارہ کاسہ پوچھو۔",
};

const LANG_PLACEHOLDER: Record<string, string> = {
  en: "Ask anything about Bitcoin…",
  hi: "बिटकॉइन के बारे में कुछ भी पूछें…",
  ta: "Bitcoin பற்றி எதுவும் கேளுங்கள்…",
  te: "Bitcoin గురించి ఏదైనా అడగండి…",
  kn: "Bitcoin ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ…",
  ml: "Bitcoin നെ കുറിച്ച് എന്തും ചോദിക്കൂ…",
  gu: "Bitcoin વિશે કંઈ પણ પૂછો…",
  pa: "Bitcoin ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ…",
  mr: "Bitcoin बद्दल काहीही विचारा…",
  bn: "Bitcoin সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন…",
  ur: "Bitcoin کے بارے میں کچھ بھی پوچھیں…",
  or: "Bitcoin ବିଷୟରେ ଯୁ ବି ପଚାରନ୍ତୁ…",
  as: "Bitcoin বিষয়ে যিকোনো কথা সোধক…",
  ks: "Bitcoin بارہ کاسہ پوچھو…",
};

function getSuggestions(messages: Message[], lang: string): string[] {
  if (messages.length === 0) return LANG_SUGGESTIONS[lang] ?? LANG_SUGGESTIONS.en;
  const recent = messages.slice(-4).map((m) => m.content.toLowerCase()).join(" ");
  for (const g of FOLLOWUPS) {
    if (g.keywords.some((kw) => recent.includes(kw))) return g.suggestions;
  }
  return ["What is Bitcoin mining?","How does the blockchain work?","What is a Bitcoin wallet?","Can Bitcoin be hacked?"];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(LANG_SUGGESTIONS.en);
  const [langSwitchBanner, setLangSwitchBanner] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [copiedIdx, setCopiedIdx]     = useState<number | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const srRef      = useRef<any>(null);

  useEffect(() => {
    setVoiceSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setSuggestions(getSuggestions(messages, selectedLang)); }, [messages, selectedLang]);

  const isRTL = RTL_LANGS.has(selectedLang);

  // ── Core send ───────────────────────────────────────────────────────────────
  const send = useCallback(async (text: string, baseMessages?: Message[]) => {
    if (!text.trim() || loading) return;
    const history = baseMessages ?? messages;

    const detected = detectLang(text);
    if (detected) { setDetectedLang(detected); setSelectedLang(detected); }
    else { setDetectedLang(null); }
    const lang = detected ?? selectedLang;

    const userMsg: Message = { role: "user", content: text };
    const next = [...history, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLangSwitchBanner(null);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, language: lang }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No response body");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: full }]);
      }

      const video = findVideo(text, full);
      const card  = video ? { day: video.day, title: video.title, url: video.url } : null;
      setMessages([...next, { role: "assistant", content: full, video: card }]);
    } catch {
      setMessages([...next, {
        role: "assistant",
        content: "Something went wrong. Please try again.",
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, loading, selectedLang]);

  // ── Retry last failed message ────────────────────────────────────────────────
  const retry = useCallback(() => {
    if (messages.length < 2) return;
    const last = messages[messages.length - 1];
    if (!last.isError) return;
    const prevUser = messages[messages.length - 2];
    if (prevUser?.role !== "user") return;
    send(prevUser.content, messages.slice(0, -2));
  }, [messages, send]);

  // ── Clear chat ───────────────────────────────────────────────────────────────
  const clearChat = useCallback(() => {
    setMessages([]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  }, []);

  // ── Copy message ─────────────────────────────────────────────────────────────
  const copyMessage = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }, []);

  // ── Voice input ──────────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (isRecording) {
      srRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const sr = new SR();
    sr.lang        = VOICE_LANG[selectedLang] ?? "hi-IN";
    sr.interimResults = false;
    sr.onstart     = () => setIsRecording(true);
    sr.onend       = () => setIsRecording(false);
    sr.onerror     = () => setIsRecording(false);
    sr.onresult    = (e: any) => setInput(e.results[0][0].transcript);
    srRef.current  = sr;
    sr.start();
  }, [isRecording, selectedLang]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const lastMsg = messages[messages.length - 1];
  const showSuggestions = !loading && lastMsg?.role === "assistant" && !lastMsg.isError;

  return (
    <div style={s.shell}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.headerTop}>
            <div style={s.logo}>
              <span style={s.logoIcon}>₿</span>
              <div>
                <div style={s.logoTitle}>Bitcoin Bharat AI</div>
                <div style={s.logoSub}>Bitcoin education in your language</div>
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} style={s.clearBtn}>Clear chat</button>
            )}
          </div>
          <div style={s.langBar}>
            {detectedLang && (
              <span style={s.detectedBadge}>
                Auto · {LANGUAGES.find((l) => l.code === detectedLang)?.label ?? detectedLang}
              </span>
            )}
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setSelectedLang(l.code);
                  setDetectedLang(null);
                  if (messages.length > 0) setLangSwitchBanner(l.label);
                }}
                style={{ ...s.langBtn, ...(selectedLang === l.code ? s.langBtnActive : {}) }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <main style={s.main}>
        {messages.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>₿</div>
            <h2 style={s.emptyTitle}>{LANG_GREETING[selectedLang] ?? LANG_GREETING.en}</h2>
            <p style={s.emptyDesc}>{LANG_PLACEHOLDER[selectedLang] ?? LANG_PLACEHOLDER.en}</p>
            <div style={s.suggestions}>
              {suggestions.map((sg) => (
                <button key={sg} style={sugStyle} onClick={() => send(sg)}>{sg}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={s.messages}>
            {messages.map((m, i) => (
              <div key={i}>
                <div style={{
                  ...s.bubble,
                  ...(m.role === "user" ? s.bubbleUser : m.isError ? s.bubbleError : s.bubbleBot),
                }}>
                  {/* Bubble header: role label + copy button */}
                  <div style={s.bubbleHeader}>
                    <div style={s.bubbleRole}>{m.role === "user" ? "You" : "Bitcoin Bharat AI"}</div>
                    {m.role === "assistant" && !m.isError && m.content && (
                      <button onClick={() => copyMessage(m.content, i)} style={s.copyBtn}>
                        {copiedIdx === i ? "✓ Copied" : "Copy"}
                      </button>
                    )}
                  </div>

                  {/* Message content */}
                  <div
                    className="markdown-body"
                    lang={m.role === "assistant" ? selectedLang : undefined}
                    style={{
                      ...s.bubbleText,
                      direction:  isRTL && m.role === "assistant" ? "rtl" : "ltr",
                      textAlign:  isRTL && m.role === "assistant" ? "right" : "left",
                    }}
                  >
                    {m.role === "assistant" ? (
                      <Markdown>
                        {m.content || (loading && i === messages.length - 1 ? "▋" : "")}
                      </Markdown>
                    ) : (
                      m.content
                    )}
                  </div>

                  {/* Retry button on error */}
                  {m.isError && (
                    <button onClick={retry} style={s.retryBtn}>↺ Retry</button>
                  )}
                </div>

                {/* Video card below bot message */}
                {m.role === "assistant" && m.video && (() => {
                  // Hindi → specific Rumble video; all others → language page
                  const watchUrl = selectedLang === "hi"
                    ? m.video.url
                    : (LANG_PAGE[selectedLang] ?? m.video.url);
                  const watchLabel = LANG_WATCH[selectedLang] ?? LANG_WATCH.en;
                  return (
                    <div style={s.videoCard}>
                      <div style={s.videoCardLabel}>▶ Day {m.video.day} · 1-min video</div>
                      <div style={s.videoCardTitle}>{m.video.title}</div>
                      <a href={watchUrl} target="_blank" rel="noopener noreferrer" style={s.videoLink}>
                        {watchLabel}
                      </a>
                    </div>
                  );
                })()}
              </div>
            ))}

            {/* Language switch banner */}
            {langSwitchBanner && (
              <div style={s.langBanner}>
                🌐 Switched to {langSwitchBanner} — next reply will be in {langSwitchBanner}
              </div>
            )}

            {/* Follow-up chips */}
            {showSuggestions && (
              <div style={s.followupRow}>
                {suggestions.map((sg) => (
                  <button key={sg} style={s.followupChip} onClick={() => send(sg)}>{sg}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.inputRow}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder={LANG_PLACEHOLDER[selectedLang] ?? LANG_PLACEHOLDER.en}
            rows={1}
            style={{
              ...s.input,
              direction: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
            disabled={loading}
          />
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              style={{ ...s.iconBtn, ...(isRecording ? s.iconBtnRecording : {}) }}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? "⏹" : "🎤"}
            </button>
          )}
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ ...s.sendBtn, ...(loading || !input.trim() ? s.sendBtnDisabled : {}) }}
          >
            {loading ? "…" : "→"}
          </button>
        </div>
        <div style={s.footerNote}>
          Bitcoin-only · Free forever · Open source ·{" "}
          <a href="https://bhartiyabitcoin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#666" }}>
            bhartiyabitcoin.com
          </a>
        </div>
      </footer>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  shell:           { display:"flex", flexDirection:"column", height:"100vh", background:"#0a0a0a", color:"#f0f0f0" },
  header:          { borderBottom:"1px solid #1e1e1e", background:"#0f0f0f", flexShrink:0 },
  headerInner:     { maxWidth:800, margin:"0 auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 },
  headerTop:       { display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:            { display:"flex", alignItems:"center", gap:10 },
  logoIcon:        { fontSize:28, color:"#f7931a", fontWeight:900, lineHeight:1 },
  logoTitle:       { fontSize:17, fontWeight:700, color:"#f0f0f0" },
  logoSub:         { fontSize:12, color:"#666" },
  clearBtn:        { background:"transparent", border:"1px solid #2a2a2a", color:"#666", borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer" },
  langBar:         { display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" },
  detectedBadge:   { fontSize:11, color:"#f7931a", background:"rgba(247,147,26,0.1)", border:"1px solid rgba(247,147,26,0.3)", borderRadius:20, padding:"2px 10px", fontWeight:600 },
  langBtn:         { background:"transparent", border:"1px solid #2a2a2a", color:"#888", borderRadius:20, padding:"3px 10px", fontSize:12, cursor:"pointer" },
  langBtnActive:   { background:"rgba(247,147,26,0.15)", border:"1px solid rgba(247,147,26,0.5)", color:"#f7931a" },
  main:            { flex:1, overflowY:"auto", padding:"16px" },
  empty:           { maxWidth:600, margin:"60px auto 0", textAlign:"center" },
  emptyIcon:       { fontSize:56, color:"#f7931a", marginBottom:16, fontWeight:900 },
  emptyTitle:      { fontSize:20, fontWeight:600, marginBottom:8, color:"#f0f0f0" },
  emptyDesc:       { fontSize:14, color:"#666", marginBottom:28 },
  suggestions:     { display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" },
  messages:        { maxWidth:760, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 },
  bubble:          { padding:"12px 16px", borderRadius:12, maxWidth:"85%", lineHeight:1.65 },
  bubbleUser:      { alignSelf:"flex-end", background:"#1a2a1a", border:"1px solid rgba(100,200,100,0.15)" },
  bubbleBot:       { alignSelf:"flex-start", background:"#141414", border:"1px solid #222" },
  bubbleError:     { alignSelf:"flex-start", background:"#1a0a0a", border:"1px solid rgba(220,50,50,0.3)" },
  bubbleHeader:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 },
  bubbleRole:      { fontSize:11, color:"#555", fontWeight:600 },
  bubbleText:      { fontSize:15, wordBreak:"break-word" },
  copyBtn:         { fontSize:11, color:"#555", background:"transparent", border:"1px solid #2a2a2a", borderRadius:6, padding:"2px 8px", cursor:"pointer" },
  retryBtn:        { marginTop:8, fontSize:12, color:"#f7931a", background:"transparent", border:"1px solid rgba(247,147,26,0.3)", borderRadius:6, padding:"4px 12px", cursor:"pointer" },
  videoCard:       { alignSelf:"flex-start", marginTop:8, background:"#0f0f0f", border:"1px solid rgba(247,147,26,0.25)", borderRadius:10, padding:"10px 14px", maxWidth:340 },
  videoCardLabel:  { fontSize:11, color:"#f7931a", fontWeight:600, marginBottom:3 },
  videoCardTitle:  { fontSize:13, color:"#f0f0f0", fontWeight:600, marginBottom:8 },
  videoLink:       { display:"inline-block", fontSize:12, color:"#f7931a", textDecoration:"none", border:"1px solid rgba(247,147,26,0.3)", borderRadius:6, padding:"3px 10px" },
  langBanner:      { fontSize:12, color:"#f7931a", background:"rgba(247,147,26,0.08)", border:"1px solid rgba(247,147,26,0.2)", borderRadius:8, padding:"8px 14px", textAlign:"center" as const },
  followupRow:     { display:"flex", flexWrap:"wrap", gap:8, paddingLeft:4 },
  followupChip:    { background:"transparent", border:"1px solid rgba(247,147,26,0.25)", color:"#f7931a", borderRadius:20, padding:"5px 13px", fontSize:12, cursor:"pointer" },
  footer:          { borderTop:"1px solid #1e1e1e", background:"#0f0f0f", padding:"12px 16px", flexShrink:0 },
  inputRow:        { maxWidth:760, margin:"0 auto", display:"flex", gap:8, alignItems:"flex-end" },
  input:           { flex:1, background:"#141414", border:"1px solid #2a2a2a", borderRadius:10, color:"#f0f0f0", fontSize:15, padding:"10px 14px", resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.5, overflowY:"hidden" },
  iconBtn:         { background:"#1e1e1e", color:"#888", border:"1px solid #2a2a2a", borderRadius:10, width:44, height:44, fontSize:18, cursor:"pointer", flexShrink:0 },
  iconBtnRecording:{ background:"rgba(220,50,50,0.15)", border:"1px solid rgba(220,50,50,0.4)", color:"#e53" },
  sendBtn:         { background:"#f7931a", color:"#000", border:"none", borderRadius:10, width:44, height:44, fontSize:20, fontWeight:700, cursor:"pointer", flexShrink:0 },
  sendBtnDisabled: { background:"#2a2a2a", color:"#555", cursor:"not-allowed" },
  footerNote:      { maxWidth:760, margin:"8px auto 0", fontSize:11, color:"#444", textAlign:"center" },
};

const sugStyle: React.CSSProperties = {
  background:"#141414", border:"1px solid #2a2a2a", color:"#bbb",
  borderRadius:20, padding:"6px 14px", fontSize:13, cursor:"pointer",
};
