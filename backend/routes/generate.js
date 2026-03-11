import { Router } from 'express';
import {
  generateSystemPrompt,
  generateStyleGuide,
  formatForTarget,
} from '../services/promptGenerator.js';

const router = Router();

// POST /api/generate
// Body: { fingerprint: object, target?: 'chatgpt'|'claude'|'generic' }
router.post('/', async (req, res) => {
  try {
    const { fingerprint, target = 'generic' } = req.body;

    if (!fingerprint || typeof fingerprint !== 'object') {
      return res.status(400).json({ error: 'fingerprint object is required' });
    }

    const [systemPrompt, styleGuide] = await Promise.all([
      generateSystemPrompt(fingerprint),
      generateStyleGuide(fingerprint),
    ]);

    res.json({
      systemPrompt: formatForTarget(systemPrompt, target),
      systemPromptRaw: systemPrompt,
      styleGuide,
      target,
    });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
