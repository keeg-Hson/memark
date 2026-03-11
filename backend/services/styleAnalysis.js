import Anthropic from '@anthropic-ai/sdk';
import { STYLE_ANALYSIS_PROMPT } from '../prompts/styleAnalysis.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Analyze writing samples and return a StyleFingerprint object.
 * @param {string[]} samples - Array of raw writing sample strings
 * @returns {Promise<object>} StyleFingerprint
 */
export async function analyzeStyle(samples) {
  if (!samples || samples.length === 0) {
    throw new Error('At least one writing sample is required');
  }

  const combinedSamples = samples
    .map((s, i) => `--- SAMPLE ${i + 1} ---\n${s.trim()}`)
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: STYLE_ANALYSIS_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here are the writing samples to analyze:\n\n${combinedSamples}`,
      },
    ],
  });

  const raw = response.content[0].text.trim();

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse style fingerprint from Claude response: ${raw.slice(0, 200)}`);
  }
}
