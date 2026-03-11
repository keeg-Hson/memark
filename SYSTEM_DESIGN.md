# Ghostwriter — System Design

## What It Does
User seeds the app with samples of their own writing. The app analyzes style patterns
and produces a ready-to-use system prompt that can be dropped into ChatGPT, Claude,
or any other LLM to make outputs sound like the user wrote them.

## No ML Layer Required
All analysis is done via the Claude API. No training, embeddings, or fine-tuning.
Claude reads the writing samples and produces the style fingerprint.

---

## Architecture

```
[Frontend: React SPA]
        |
        | REST
        v
[Backend: Express API]
        |
        |-- /api/analyze   → StyleAnalysisService
        |-- /api/generate  → PromptGeneratorService
        |-- /api/export    → ExportService
        |
        v
[Claude API (claude-sonnet-4-20250514)]
```

---

## Data Flow

1. User uploads files or pastes text samples (1–20 writing samples)
2. Frontend sends samples to POST /api/analyze
3. StyleAnalysisService batches samples → sends to Claude with analysis meta-prompt
4. Claude returns structured style fingerprint (JSON)
5. PromptGeneratorService converts fingerprint → output formats
6. User gets back:
   - A copyable system prompt block
   - A plain-English style guide document
   - Optionally: a .txt/.md file download

---

## Core Services

### StyleAnalysisService
- Accepts: array of raw text strings
- Sends to Claude: samples + analysis prompt
- Returns: StyleFingerprint object

### PromptGeneratorService
- Accepts: StyleFingerprint
- Produces: system prompt string (for ChatGPT/Claude injection)
- Produces: human-readable style guide

### ExportService
- Formats output for different targets:
  - ChatGPT custom instructions
  - Claude project instructions
  - Plain .txt for any LLM
  - Markdown style guide doc

---

## StyleFingerprint Schema

```json
{
  "voice": "first-person, direct, slightly sardonic",
  "sentenceStructure": "short declarative sentences, occasional fragments for emphasis",
  "vocabularyLevel": "conversational but precise, avoids jargon",
  "punctuationHabits": "em-dashes for asides, minimal commas, no semicolons",
  "paragraphRhythm": "short paragraphs, white space as pacing tool",
  "toneMarkers": ["dry humor", "rhetorical questions", "blunt openers"],
  "avoidPatterns": ["passive voice", "filler phrases like 'in order to'", "corporate-speak"],
  "examplePhrases": ["...", "..."],
  "openingStyle": "drops into subject immediately, no throat-clearing",
  "closingStyle": "ends on a point, rarely summarizes"
}
```

---

## Frontend Pages

- `/` — Landing / upload page
- `/analyze` — Shows analysis progress + fingerprint results
- `/output` — Final system prompt + style guide with copy/export controls

---

## Tech Stack

| Layer     | Choice         | Why                                      |
|-----------|---------------|------------------------------------------|
| Frontend  | React + Vite   | Fast dev, SPA routing                    |
| Styling   | Tailwind CSS   | Utility-first, quick iteration           |
| Backend   | Node + Express | Lightweight, easy Claude API integration |
| AI        | Claude API     | Does the heavy lifting on style analysis |
| Files     | Multer         | File upload handling                     |
| Export    | file-saver     | Client-side .txt/.md download            |

---

## MVP Scope (Phase 1)

- [ ] Paste text input (no file upload yet)
- [ ] Call Claude to analyze style
- [ ] Display style fingerprint
- [ ] Generate copyable system prompt
- [ ] Copy to clipboard button

## Phase 2

- [ ] File upload (.txt, .docx, .pdf, .md)
- [ ] Multiple sample management (add/remove)
- [ ] Export as .txt / .md download
- [ ] Target-specific formatting (ChatGPT vs Claude)

## Phase 3

- [ ] User accounts + saved style profiles
- [ ] Iterative refinement ("make it more casual")
- [ ] Test mode: paste a prompt, see it rewritten in your style
