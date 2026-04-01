'use client';

import { LINKEDIN_MAX_CHARS } from '@/lib/constants';

interface CharCounterProps {
  count: number;
}

export function CharCounter({ count }: CharCounterProps) {
  const percentage  = Math.min((count / LINKEDIN_MAX_CHARS) * 100, 100);
  const isWarning   = percentage > 80;
  const isOver      = count > LINKEDIN_MAX_CHARS;

  const trackColor = isOver
    ? 'rgba(248,113,113,1)'
    : isWarning
    ? 'rgba(251,191,36,1)'
    : 'rgba(139,92,246,1)';

  const textColor = isOver
    ? 'rgba(248,113,113,1)'
    : isWarning
    ? 'rgba(251,191,36,0.90)'
    : 'rgba(255,255,255,0.55)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.40)',
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Characters
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: '"DM Sans", sans-serif',
            color: textColor,
            transition: 'color 0.2s',
          }}
        >
          {count.toLocaleString()} / {LINKEDIN_MAX_CHARS.toLocaleString()}
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          height: '3px',
          borderRadius: '99px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '99px',
            width: `${percentage}%`,
            background: trackColor,
            boxShadow: isOver ? `0 0 6px ${trackColor}` : 'none',
            transition: 'width 0.3s ease, background 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}