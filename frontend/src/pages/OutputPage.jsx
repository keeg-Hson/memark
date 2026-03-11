import { useState } from 'react';

export default function OutputPage({ gw }) {
  const { outputs, fingerprint, reset } = gw;
  const [activeTab, setActiveTab] = useState('prompt');
  const [copied, setCopied] = useState(null);

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const download = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const targetInstructions = {
    chatgpt: 'Settings → Personalization → Custom Instructions → "How would you like ChatGPT to respond?"',
    claude: 'Project → Edit Project → Project Instructions',
    generic: 'System prompt / instructions field of any LLM',
  }[outputs.target];

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 22,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>Memark</span>
          <span className="tag">Beta</span>
        </div>
        <button
          onClick={reset}
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Instrument Sans, sans-serif',
          }}
        >
          ← Start over
        </button>
      </header>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 40px 80px' }}>

        {/* Title */}
        <div className="animate-fade-up" style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent)', display: 'inline-block',
            }} />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              Mark generated
            </span>
          </div>
          <h1 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(32px, 4vw, 46px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}>
            Your writing mark<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>is ready.</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="animate-fade-up delay-1" style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: 32,
          gap: 0,
        }}>
          {[
            { key: 'prompt', label: 'System Prompt' },
            { key: 'fingerprint', label: 'Style Fingerprint' },
            { key: 'guide', label: 'Style Guide' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--ink)' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? 'var(--ink)' : 'var(--muted)',
                fontFamily: 'Instrument Sans, sans-serif',
                marginBottom: '-1px',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Prompt Tab */}
        {activeTab === 'prompt' && (
          <div className="animate-fade-in">
            <div style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--paper-dark)',
              }}>
                <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                  SYSTEM_PROMPT.txt
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn onClick={() => download(outputs.systemPromptRaw, 'memark-prompt.txt')} label="↓ Download" />
                  <ActionBtn
                    onClick={() => copy(outputs.systemPromptRaw, 'prompt')}
                    label={copied === 'prompt' ? '✓ Copied' : 'Copy'}
                    active={copied === 'prompt'}
                  />
                </div>
              </div>
              <pre style={{
                padding: '20px',
                fontSize: 13,
                lineHeight: 1.75,
                fontFamily: 'DM Mono, monospace',
                fontWeight: 300,
                color: 'var(--ink)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 360,
                overflow: 'auto',
              }}>
                {outputs.systemPromptRaw}
              </pre>
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'var(--accent-light)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              fontSize: 12,
              color: 'var(--accent)',
              fontFamily: 'DM Mono, monospace',
            }}>
              → Paste into: {targetInstructions}
            </div>
          </div>
        )}

        {/* Fingerprint Tab */}
        {activeTab === 'fingerprint' && fingerprint && (
          <div className="animate-fade-in">
            <div style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              {[
                { key: 'voice', label: 'Voice' },
                { key: 'sentenceStructure', label: 'Sentence Structure' },
                { key: 'vocabularyLevel', label: 'Vocabulary' },
                { key: 'punctuationHabits', label: 'Punctuation' },
                { key: 'paragraphRhythm', label: 'Rhythm' },
                { key: 'openingStyle', label: 'Openings' },
                { key: 'closingStyle', label: 'Closings' },
              ].filter(f => fingerprint[f.key]).map((field, i, arr) => (
                <div key={field.key} style={{
                  display: 'flex',
                  gap: 24,
                  padding: '16px 20px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'DM Mono, monospace',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    minWidth: 120,
                    paddingTop: 2,
                  }}>
                    {field.label}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
                    {fingerprint[field.key]}
                  </span>
                </div>
              ))}
              {/* Array fields */}
              {[
                { key: 'toneMarkers', label: 'Tone Markers' },
                { key: 'signaturePatterns', label: 'Signature Patterns' },
                { key: 'avoidPatterns', label: 'Avoids' },
                { key: 'examplePhrases', label: 'Example Phrases' },
              ].filter(f => fingerprint[f.key]?.length > 0).map((field, i) => (
                <div key={field.key} style={{
                  display: 'flex',
                  gap: 24,
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border)',
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'DM Mono, monospace',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    minWidth: 120,
                    paddingTop: 6,
                  }}>
                    {field.label}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {fingerprint[field.key].map((item, j) => (
                      <span key={j} style={{
                        padding: '3px 10px',
                        background: 'var(--paper)',
                        border: '1px solid var(--border)',
                        borderRadius: 99,
                        fontSize: 12,
                        color: 'var(--ink)',
                        fontFamily: 'Instrument Sans, sans-serif',
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Guide Tab */}
        {activeTab === 'guide' && (
          <div className="animate-fade-in">
            <div style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--paper-dark)',
              }}>
                <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                  STYLE_GUIDE.md
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn onClick={() => download(outputs.styleGuide, 'memark-style-guide.md')} label="↓ Download" />
                  <ActionBtn
                    onClick={() => copy(outputs.styleGuide, 'guide')}
                    label={copied === 'guide' ? '✓ Copied' : 'Copy'}
                    active={copied === 'guide'}
                  />
                </div>
              </div>
              <div style={{
                padding: '24px',
                fontSize: 14,
                lineHeight: 1.8,
                color: 'var(--ink)',
                maxHeight: 480,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Instrument Sans, sans-serif',
              }}>
                {outputs.styleGuide}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ActionBtn({ onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        border: '1px solid var(--border)',
        borderRadius: 3,
        background: active ? 'var(--ink)' : 'white',
        color: active ? 'var(--paper)' : 'var(--muted)',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'DM Mono, monospace',
        transition: 'all 0.15s',
        letterSpacing: '0.03em',
      }}
    >
      {label}
    </button>
  );
}
