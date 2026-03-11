export default function SampleEditor({ index, value, onChange, onRemove, disabled }) {
  return (
    <div className="relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Sample ${index + 1} — paste a blog post, email, essay, anything you've written…`}
        rows={6}
        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 placeholder-stone-600 text-sm resize-y focus:outline-none focus:border-stone-600 disabled:opacity-40 transition-colors"
      />
      {onRemove && !disabled && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-stone-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs"
        >
          remove
        </button>
      )}
      <div className="mt-1 text-right text-xs text-stone-700">
        {value.length} chars {value.length < 50 && value.length > 0 && '(need 50+)'}
      </div>
    </div>
  );
}
