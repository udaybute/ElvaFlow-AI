'use client';

import { POST_TYPES } from '@/lib/constants';
import { PostType } from '@/types';

interface TypeSelectorProps {
  value: PostType;
  onChange: (value: PostType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
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
        Post Type
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}
        className="sm:grid-cols-3"
      >
        {POST_TYPES.map((type) => {
          const isActive = value === type.value;

          return (
            <button
              key={type.value}
              onClick={() => onChange(type.value)}
              style={{
                borderRadius: '14px',
                border: isActive
                  ? '1px solid rgba(167,139,250,0.50)'
                  : '1px solid rgba(255,255,255,0.07)',
                background: isActive
                  ? 'linear-gradient(145deg, rgba(139,92,246,0.16), rgba(236,72,153,0.08))'
                  : 'rgba(255,255,255,0.025)',
                boxShadow: isActive
                  ? '0 0 18px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : 'none',
                padding: '12px 13px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                minHeight: '60px',
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
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isActive ? 'rgba(216,180,254,1)' : 'rgba(255,255,255,0.78)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {type.label}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: isActive ? 'rgba(216,180,254,0.55)' : 'rgba(255,255,255,0.32)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  marginTop: '5px',
                  lineHeight: 1.4,
                }}
              >
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}