import { useState } from 'react';

export default function CopyBlock({ content, mono = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-stone-900 border border-stone-800 rounded-lg overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 text-xs px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white rounded transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        className={`px-5 py-4 text-sm text-stone-300 whitespace-pre-wrap overflow-auto max-h-80 ${
          mono ? 'font-mono' : 'font-sans leading-relaxed'
        }`}
      >
        {content}
      </pre>
    </div>
  );
}
