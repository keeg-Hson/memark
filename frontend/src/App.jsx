import { useState } from 'react';
import { useGhostwriter } from './hooks/useGhostwriter.js';
import SeedPage from './pages/SeedPage.jsx';
import OutputPage from './pages/OutputPage.jsx';

export default function App() {
  const gw = useGhostwriter();
  if (gw.status === 'done' && gw.outputs) return <OutputPage gw={gw} />;
  return <SeedPage gw={gw} />;
}
