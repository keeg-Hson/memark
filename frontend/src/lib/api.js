const BASE = '/api';

export async function analyzeSamples(samples) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ samples }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Analysis failed');
  }
  return res.json(); // { fingerprint }
}

export async function generateOutputs(fingerprint, target = 'generic') {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fingerprint, target }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Generation failed');
  }
  return res.json(); // { systemPrompt, systemPromptRaw, styleGuide, target }
}
