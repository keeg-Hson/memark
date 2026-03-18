import { Router } from 'express';
import {
  generateSystemPrompt,
  generateStyleGuide,
  generateSeedPrompt,
  formatForTarget,
} from '../services/promptGenerator.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { fingerprint, target = 'generic' } = req.body;
    if (!fingerprint || typeof fingerprint !== 'object') {
      return res.status(400).json({ error: 'fingerprint object is required' });
    }
    const [systemPrompt, styleGuide, seedPrompt] = await Promise.all([
      generateSystemPrompt(fingerprint),
      generateStyleGuide(fingerprint),
      generateSeedPrompt(fingerprint),
    ]);
    res.json({
      systemPrompt: formatForTarget(systemPrompt, target),
      systemPromptRaw: systemPrompt,
      styleGuide,
      seedPrompt,
      target,
    });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
