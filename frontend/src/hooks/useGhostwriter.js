import { useState, useCallback } from 'react';
import { analyzeSamples, generateOutputs } from '../lib/api.js';

export function useGhostwriter() {
  const [samples, setSamples] = useState(['']);
  const [fingerprint, setFingerprint] = useState(null);
  const [outputs, setOutputs] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [target, setTarget] = useState('generic');

  const addSample = useCallback(() => setSamples(p => [...p, '']), []);
  const removeSample = useCallback(i => setSamples(p => p.filter((_, idx) => idx !== i)), []);
  const updateSample = useCallback((i, v) => setSamples(p => p.map((s, idx) => idx === i ? v : s)), []);

  const run = useCallback(async () => {
    const valid = samples.filter(s => s.trim().length > 50);
    if (valid.length === 0) {
      setError('Add at least one writing sample (50+ characters)');
      return;
    }
    setError(null);
    try {
      setStatus('analyzing');
      const { fingerprint: fp } = await analyzeSamples(valid);
      setFingerprint(fp);
      setStatus('generating');
      const result = await generateOutputs(fp, target);
      setOutputs(result);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [samples, target]);

  const reset = useCallback(() => {
    setSamples(['']);
    setFingerprint(null);
    setOutputs(null);
    setStatus('idle');
    setError(null);
  }, []);

  return { samples, fingerprint, outputs, status, error, target, setTarget, addSample, removeSample, updateSample, run, reset };
}
