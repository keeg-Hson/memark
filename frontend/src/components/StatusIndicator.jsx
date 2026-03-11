const MESSAGES = {
  idle: null,
  analyzing: 'Reading your writing samples…',
  generating: 'Building your style profile…',
  error: null,
  done: null,
};

export default function StatusIndicator({ status }) {
  const message = MESSAGES[status];
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 text-sm text-stone-400">
      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      {message}
    </div>
  );
}
