import Anthropic from '@anthropic-ai/sdk';
import {
  SYSTEM_PROMPT_GENERATION_PROMPT,
  STYLE_GUIDE_PROMPT,
} from '../prompts/styleAnalysis.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate a system prompt from a StyleFingerprint.
 * @param {object} fingerprint
 * @returns {Promise<string>} System prompt text
 */
export async function generateSystemPrompt(fingerprint) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT_GENERATION_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Style fingerprint:\n${JSON.stringify(fingerprint, null, 2)}`,
      },
    ],
  });

  return response.content[0].text.trim();
}

/**
 * Generate a human-readable style guide from a StyleFingerprint.
 * @param {object} fingerprint
 * @returns {Promise<string>} Markdown style guide
 */
export async function generateStyleGuide(fingerprint) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: STYLE_GUIDE_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Style fingerprint:\n${JSON.stringify(fingerprint, null, 2)}`,
      },
    ],
  });

  return response.content[0].text.trim();
}

/**
 * Format a system prompt for a specific LLM target.
 * @param {string} systemPrompt
 * @param {'chatgpt'|'claude'|'generic'} target
 * @returns {string}
 */
export function formatForTarget(systemPrompt, target) {
  switch (target) {
    case 'chatgpt':
      return `[Paste this into ChatGPT's "Custom Instructions > How would you like ChatGPT to respond?" field]\n\n${systemPrompt}`;
    case 'claude':
      return `[Paste this into a Claude Project's "Project Instructions" field]\n\n${systemPrompt}`;
    case 'generic':
    default:
      return systemPrompt;
  }
}
