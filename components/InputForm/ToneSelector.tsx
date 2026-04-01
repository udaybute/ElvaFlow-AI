'use client';

import { POST_TONES, POST_LENGTHS } from '@/lib/constants';
import { PostTone, PostLength } from '@/types';

const TONE_ICONS: Record<string, string> = {
  'professional':   '🎯',
  'conversational': '💬',
  'inspiring':      '✨',
  'storytelling':   '📜',
  'analytical':     '📊',
};

interface ToneSelectorProps {
  tone: PostTone;
  length: PostLength;
  onToneChange: (tone: PostTone) => void;
  onLengthChange: (length: PostLength) => void;
}

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
  fontFamily: '"DM Sans", sans-serif',
};

export function ToneSelector({ tone, length, onToneChange, onLengthChange }: ToneSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* ── Tone pills ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={SECTION_LABEL_STYLE}>Tone</label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {POST_TONES.map((t) => {
            const isActive = tone === t.value;
            return (
              <button
                key={t.value}
                onClick={() => onToneChange(t.value)}
                style={{
                  borderRadius: '20px',
                  border: isActive
                    ? '1px solid rgba(167,139,250,0.55)'
                    : '1px solid rgba(255,255,255,0.09)',
                  background: isActive
                    ? 'rgba(139,92,246,0.18)'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: isActive ? '0 0 12px rgba(139,92,246,0.18)' : 'none',
                  padding: '6px 14px',
                  minHeight: '32px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: '"DM Sans", sans-serif',
                  color: isActive ? 'rgba(216,180,254,1)' : 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.22)';
                    (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.80)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.09)';
                    (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                <span style={{ fontSize: '12px', lineHeight: 1 }}>{TONE_ICONS[t.value]}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Length selector ────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={SECTION_LABEL_STYLE}>Length</label>

        <div style={{ display: 'flex', gap: '8px' }}>
          {POST_LENGTHS.map((l) => {
            const isActive = length === l.value;
            return (
              <button
                key={l.value}
                onClick={() => onLengthChange(l.value)}
                style={{
                  flex: 1,
                  borderRadius: '14px',
                  border: isActive
                    ? '1px solid rgba(167,139,250,0.50)'
                    : '1px solid rgba(255,255,255,0.07)',
                  background: isActive
                    ? 'linear-gradient(145deg, rgba(139,92,246,0.16), rgba(236,72,153,0.08))'
                    : 'rgba(255,255,255,0.025)',
                  boxShadow: isActive ? '0 0 16px rgba(139,92,246,0.12)' : 'none',
                  padding: '11px 8px',
                  minHeight: '56px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.025)';
                  }
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: '"DM Sans", sans-serif',
                    color: isActive ? 'rgba(216,180,254,1)' : 'rgba(255,255,255,0.72)',
                  }}
                >
                  {l.label}
                </span>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: '"DM Sans", sans-serif',
                    color: isActive ? 'rgba(216,180,254,0.50)' : 'rgba(255,255,255,0.28)',
                  }}
                >
                  ~{l.chars} chars
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}