'use client';

import { Textarea } from '@/components/ui/textarea';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX = 500;
const WARN = 450;

export function TopicInput({ value, onChange }: TopicInputProps) {
  const nearLimit = value.length >= WARN;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        Topic / Idea
      </label>

      <div
        style={{
          position: 'relative',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.50)';
          (e.currentTarget as HTMLDivElement).style.boxShadow  = '0 0 0 3px rgba(139,92,246,0.10)';
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.09)';
          (e.currentTarget as HTMLDivElement).style.boxShadow  = 'none';
        }}
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. I just launched my first SaaS after 6 months building in public…"
          maxLength={MAX}
          style={{
            minHeight: '112px',
            resize: 'none',
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '14px 16px',
            paddingBottom: '32px',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.88)',
            fontFamily: '"DM Sans", sans-serif',
            caretColor: 'rgba(167,139,250,1)',
          }}
        />

        {/* Character count — lives inside the textarea box */}
        <span
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '14px',
            fontSize: '10.5px',
            fontFamily: '"DM Sans", sans-serif',
            fontVariantNumeric: 'tabular-nums',
            color: nearLimit ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.22)',
            transition: 'color 0.2s',
            pointerEvents: 'none',
          }}
        >
          {value.length}/{MAX}
        </span>
      </div>
    </div>
  );
}