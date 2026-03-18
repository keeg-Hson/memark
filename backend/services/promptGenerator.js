import Anthropic from '@anthropic-ai/sdk';
import {
  SYSTEM_PROMPT_GENERATION_PROMPT,
  STYLE_GUIDE_PROMPT,
  SEED_PROMPT,
} from '../prompts/styleAnalysis.js';

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function generateSystemPrompt(fingerprint) {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT_GENERATION_PROMPT,
    messages: [{ role: 'user', content: `Style fingerprint:\n${JSON.stringify(fingerprint, null, 2)}` }],
  });
  return response.content[0].text.trim();
}

export async function generateStyleGuide(fingerprint) {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: STYLE_GUIDE_PROMPT,
    messages: [{ role: 'user', content: `Style fingerprint:\n${JSON.stringify(fingerprint, null, 2)}` }],
  });
  return response.content[0].text.trim();
}

export async function generateSeedPrompt(fingerprint) {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    system: SEED_PROMPT,
    messages: [{ role: 'user', content: `Style fingerprint:\n${JSON.stringify(fingerprint, null, 2)}` }],
  });
  return response.content[0].text.trim();
}

export function formatForTarget(systemPrompt, target) {
  switch (target) {
    case 'chatgpt':
      return `[Paste into ChatGPT: Settings → Personalization → Custom Instructions]\n\n${systemPrompt}`;
    case 'claude':
      return `[Paste into Claude: Project → Project Instructions]\n\n${systemPrompt}`;
    default:
      return systemPrompt;
  }
}
