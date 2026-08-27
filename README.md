# Bitcoin Bharat AI

A Bitcoin-only education chatbot for Indian users, answering questions in Hindi, English, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Marathi, Urdu, Odia, Assamese, Kashmiri, and Sindhi.

Built on a 60-day curriculum from [bhartiyabitcoin.com](https://bhartiyabitcoin.com). Powered by Gemini 2.5 Flash via the Google AI API.

---

## Features

- Responds in whichever Indian language the user writes in (auto-detected)
- Bitcoin-only scope — politely redirects altcoin/DeFi/NFT questions
- Streams responses token-by-token
- Suggests relevant 1-minute Hindi video lessons after each answer
- No financial advice, no price predictions

## Project Structure

```
bitcoin-bharat/
├── ui/                  # Next.js 15 chat interface
│   ├── src/app/
│   │   ├── page.tsx     # Chat UI (single-page, client component)
│   │   └── api/chat/    # Streaming API route (Google Generative AI)
│   └── package.json
├── knowledge-base/      # 60-day curriculum reference docs
├── recipes/             # Claude.ai agent recipe (bitcoin-bharat.yaml)
├── content/             # (planned: multilingual static content)
├── mcp-extension/       # (planned: MCP server extension)
└── scripts/             # (planned: utility scripts)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com) API key (free tier works)

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/bitcoin-bharat.git
cd bitcoin-bharat/ui
npm install
cp .env.local.example .env.local
# Edit .env.local and add your GOOGLE_AI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_AI_API_KEY` | Yes | Google AI Studio key — get one free at aistudio.google.com |
| `GEMMA_MODEL` | No | Override the model (default: `gemini-2.5-flash`) |

## Deployment

Works with any Next.js host. For Vercel:

```bash
cd ui
npx vercel
```

Set `GOOGLE_AI_API_KEY` in the Vercel dashboard under Project → Settings → Environment Variables.

## Contributing

Contributions are welcome. A few ground rules:

- **Bitcoin-only scope is non-negotiable.** Do not add support for altcoins, DeFi, NFTs, or trading features.
- **Language support** — PRs adding better detection or responses for more Indian languages are very welcome.
- **Knowledge base** — corrections or additions to `knowledge-base/60-day-curriculum.md` should cite bhartiyabitcoin.com or the Bitcoin whitepaper.
- Open an issue first for large changes so we can discuss before you build.

### Running locally

```bash
cd ui
npm run dev   # dev server at localhost:3000
npm run build # production build check
npm run lint  # ESLint
```

There are no automated tests yet — adding them is a good first contribution.

## License

MIT — see [LICENSE](./LICENSE).
