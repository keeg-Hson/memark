# memark
Paste samples of your writing. Get a system prompt that makes any LLM sound exactly like you.

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
npm install
npm run dev
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. Open http://localhost:5173

---

## What you need
- Node.js 18+
- An Anthropic API key → https://console.anthropic.com

## How it works
1. Paste 1–5 samples of your own writing (emails, essays, messages — anything real)
2. Memark sends them to Claude with a style analysis meta-prompt
3. Claude returns a structured style fingerprint
4. A second pass converts the fingerprint into a ready-to-use system prompt + style guide
5. Drop the system prompt into ChatGPT custom instructions, a Claude Project, or any LLM

## Project structure
```
memark/
├── backend/
│   ├── server.js
│   ├── routes/         analyze.js, generate.js
│   ├── services/       styleAnalysis.js, promptGenerator.js
│   └── prompts/        styleAnalysis.js  ← meta-prompts live here
└── frontend/
    └── src/
        ├── pages/      SeedPage.jsx, OutputPage.jsx
        ├── hooks/      useGhostwriter.js
        └── lib/        api.js
```
