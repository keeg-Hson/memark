export default function FingerprintView({ fingerprint }) {
  const fields = [
    { key: 'voice', label: 'Voice' },
    { key: 'sentenceStructure', label: 'Sentence Structure' },
    { key: 'vocabularyLevel', label: 'Vocabulary' },
    { key: 'punctuationHabits', label: 'Punctuation' },
    { key: 'paragraphRhythm', label: 'Rhythm' },
    { key: 'openingStyle', label: 'Openings' },
    { key: 'closingStyle', label: 'Closings' },
  ];

  const arrayFields = [
    { key: 'toneMarkers', label: 'Tone Markers' },
    { key: 'signaturePatterns', label: 'Signature Patterns' },
    { key: 'avoidPatterns', label: 'Avoids' },
    { key: 'examplePhrases', label: 'Example Phrases' },
  ];

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg divide-y divide-stone-800">
      {fields.map(({ key, label }) =>
        fingerprint[key] ? (
          <div key={key} className="px-5 py-3 flex gap-4">
            <span className="text-xs text-stone-600 uppercase tracking-wider w-32 shrink-0 pt-0.5">
              {label}
            </span>
            <span className="text-sm text-stone-300">{fingerprint[key]}</span>
          </div>
        ) : null
      )}
      {arrayFields.map(({ key, label }) =>
        fingerprint[key]?.length > 0 ? (
          <div key={key} className="px-5 py-3 flex gap-4">
            <span className="text-xs text-stone-600 uppercase tracking-wider w-32 shrink-0 pt-0.5">
              {label}
            </span>
            <div className="flex flex-wrap gap-2">
              {fingerprint[key].map((item, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-stone-800 text-stone-400 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
