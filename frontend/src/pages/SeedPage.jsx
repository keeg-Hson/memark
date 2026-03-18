import { useState } from 'react';

const TARGETS = [
  { value: 'generic', label: 'Any LLM' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
];

export default function SeedPage({ gw }) {
  const isRunning = gw.status === 'analyzing' || gw.status === 'generating';

  const statusLabel = {
    analyzing: 'Reading your writing…',
    generating: 'Building your mark…',
  }[gw.status] || null;

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="animate-fade-up" style={{
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
        <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
          your voice, everywhere
        </span>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 40px 80px' }}>

        {/* Hero */}
        <div className="animate-fade-up delay-1" style={{ marginBottom: 56 }}>
          <h1 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(36px, 5vw, 54px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginBottom: 16,
          }}>
            Paste your writing.<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Get your mark.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 480 }}>
            Memark reads your writing samples and produces a system prompt
            that makes any LLM sound exactly like you.
          </p>
        </div>

        {/* Samples */}
        <div className="animate-fade-up delay-2" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <label style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              fontFamily: 'DM Mono, monospace',
            }}>
              Writing Samples
            </label>
            <button
              onClick={gw.addSample}
              disabled={isRunning || gw.samples.length >= 5}
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Instrument Sans, sans-serif',
                opacity: (isRunning || gw.samples.length >= 5) ? 0.4 : 1,
              }}
            >
              + Add sample
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gw.samples.map((sample, i) => (
              <SampleBlock
                key={i}
                index={i}
                value={sample}
                onChange={v => gw.updateSample(i, v)}
                onRemove={gw.samples.length > 1 ? () => gw.removeSample(i) : null}
                disabled={isRunning}
              />
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, fontFamily: 'DM Mono, monospace' }}>
            Tip: emails, essays, Slack messages, anything you've actually written. Min 50 chars each.
          </p>
        </div>

        {/* Target */}
        <div className="animate-fade-up delay-3" style={{ marginBottom: 40 }}>
          <label style={{
            display: 'block',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontFamily: 'DM Mono, monospace',
            marginBottom: 12,
          }}>
            Output Target
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {TARGETS.map(t => (
              <button
                key={t.value}
                onClick={() => gw.setTarget(t.value)}
                disabled={isRunning}
                style={{
                  padding: '8px 20px',
                  border: `1px solid ${gw.target === t.value ? 'var(--ink)' : 'var(--border)'}`,
                  borderRadius: 4,
                  background: gw.target === t.value ? 'var(--ink)' : 'transparent',
                  color: gw.target === t.value ? 'var(--paper)' : 'var(--muted)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'Instrument Sans, sans-serif',
                  fontWeight: gw.target === t.value ? 500 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {gw.error && (
          <div className="animate-fade-in" style={{
            padding: '12px 16px',
            background: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            borderRadius: 4,
            color: 'var(--accent)',
            fontSize: 13,
            marginBottom: 24,
          }}>
            {gw.error}
          </div>
        )}

        {/* CTA */}
        <div className="animate-fade-up delay-4">
          <button
            onClick={gw.run}
            disabled={isRunning}
            style={{
              width: '100%',
              padding: '18px 32px',
              background: isRunning ? 'var(--muted)' : 'var(--ink)',
              color: 'var(--paper)',
              border: 'none',
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontFamily: 'Instrument Sans, sans-serif',
              letterSpacing: '0.01em',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {isRunning ? (
              <>
                <Spinner />
                {statusLabel}
              </>
            ) : (
              'Generate My Mark →'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

function SampleBlock({ index, value, onChange, onRemove, disabled }) {
  const charCount = value.length;
  const isShort = charCount > 0 && charCount < 50;

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={v => gw.updateSample(i, v.slice(0, 3000))} /* v.slice(min char value, max char value permitted) */ 
        disabled={disabled}
        placeholder={`Sample ${index + 1} — paste an email, essay, Slack message, anything you've written…`}
        rows={5}
        style={{
          width: '100%',
          padding: '16px',
          background: 'white',
          border: `1px solid ${isShort ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 4,
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--ink)',
          resize: 'vertical',
          fontFamily: 'Instrument Sans, sans-serif',
          transition: 'border-color 0.15s ease',
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = 'var(--ink)'; }}
        onBlur={e => { e.target.style.borderColor = isShort ? 'var(--accent)' : 'var(--border)'; }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingInline: 2,
      }}>
        <span style={{ fontSize: 11, color: isShort ? 'var(--accent)' : 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
          {charCount > 0 && (isShort ? `${charCount}/50 min` : `${charCount}/50000`)}
        </span>
        {onRemove && !disabled && (
          <button
            onClick={onRemove}
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
            }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 12" />
    </svg>
  );
}
