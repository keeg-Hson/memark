const TARGETS = [
  { value: 'generic', label: 'Any LLM', description: 'Plain system prompt, works everywhere' },
  { value: 'chatgpt', label: 'ChatGPT', description: 'Formatted for Custom Instructions' },
  { value: 'claude', label: 'Claude', description: 'Formatted for Project Instructions' },
];

export default function TargetSelector({ value, onChange, disabled }) {
  return (
    <div className="flex gap-3">
      {TARGETS.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          disabled={disabled}
          className={`flex-1 px-4 py-3 rounded-lg border text-left transition-colors disabled:opacity-40 ${
            value === t.value
              ? 'border-white bg-stone-800 text-white'
              : 'border-stone-800 bg-stone-900 text-stone-500 hover:border-stone-600 hover:text-stone-300'
          }`}
        >
          <div className="text-sm font-medium">{t.label}</div>
          <div className="text-xs mt-0.5 opacity-70">{t.description}</div>
        </button>
      ))}
    </div>
  );
}
