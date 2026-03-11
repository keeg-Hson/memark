import { Router } from 'express';
import { analyzeStyle } from '../services/styleAnalysis.js';

const router = Router();

// POST /api/analyze
// Body: { samples: string[] }
router.post('/', async (req, res) => {
  try {
    const { samples } = req.body;

    if (!Array.isArray(samples) || samples.length === 0) {
      return res.status(400).json({ error: 'samples must be a non-empty array of strings' });
    }

    const validSamples = samples.filter((s) => typeof s === 'string' && s.trim().length > 50);
    if (validSamples.length === 0) {
      return res.status(400).json({ error: 'Each sample must be at least 50 characters' });
    }

    const fingerprint = await analyzeStyle(validSamples);
    res.json({ fingerprint });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
