'use client';

import { useState } from 'react';
import { GeneratedPost } from '@/types';
import { Sparkles, Star, Copy, Check } from 'lucide-react';

interface VariationPickerProps {
  variations: GeneratedPost[];
  selected: number;
  onSelect: (i: number) => void;
}

const LABELS  = ['Version A', 'Version B', 'Version C'];
const ANGLES  = ['Personal angle', 'Data-driven', 'Bold & direct'];

const PALETTE = [
  {
    activeBorder : 'rgba(96,165,250,0.50)',
    activeBg     : 'rgba(59,130,246,0.10)',
    activeGlow   : '0 0 18px rgba(59,130,246,0.14)',
    labelActive  : 'rgba(147,197,253,1)',
    bar          : 'rgba(96,165,250,1)',
  },
  {
    activeBorder : 'rgba(167,139,250,0.50)',
    activeBg     : 'rgba(139,92,246,0.10)',
    activeGlow   : '0 0 18px rgba(139,92,246,0.14)',
    labelActive  : 'rgba(216,180,254,1)',
    bar          : 'rgba(167,139,250,1)',
  },
  {
    activeBorder : 'rgba(244,114,182,0.50)',
    activeBg     : 'rgba(236,72,153,0.10)',
    activeGlow   : '0 0 18px rgba(236,72,153,0.14)',
    labelActive  : 'rgba(249,168,212,1)',
    bar          : 'rgba(244,114,182,1)',
  },
];

function VariationCopyBtn({ content, hashtags }: { content: string; hashtags: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${content}\n\n${hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy this variation"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '7px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: copied ? 'rgba(52,211,153,1)' : 'rgba(255,255,255,0.55)',
        transition: 'all 0.15s ease',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

export function VariationPicker({ variations, selected, onSelect }: VariationPickerProps) {
  if (variations.length === 0) return null;

  const bestIdx = variations.reduce(
    (best, v, i) => ((v.score?.overall ?? 0) > (variations[best].score?.overall ?? 0) ? i : best),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sparkles size={11} style={{ color: 'rgba(139,92,246,0.70)' }} />
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.40)',
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          3 Variations — pick your favourite
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {variations.map((v, i) => {
          const score      = v.score?.overall ?? 0;
          const isSelected = i === selected;
          const isBest     = bestIdx === i;
          const p          = PALETTE[i];

          return (
            <div
              key={v.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(i)}
              className="group relative"
              style={{
                borderRadius: '14px',
                border: isSelected
                  ? `1px solid ${p.activeBorder}`
                  : '1px solid rgba(255,255,255,0.07)',
                background: isSelected
                  ? p.activeBg
                  : 'rgba(255,255,255,0.025)',
                boxShadow: isSelected ? p.activeGlow : 'none',
                padding: '12px 10px 10px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                outline: 'none',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,0.025)';
                }
              }}
            >
              {/* Best badge */}
              {isBest && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff',
                    fontSize: '8.5px',
                    fontWeight: 800,
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '20px',
                    padding: '2px 7px',
                    boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                  }}
                >
                  <Star size={8} style={{ fill: '#fff', strokeWidth: 0 }} />
                  Best
                </span>
              )}

              <VariationCopyBtn content={v.content} hashtags={v.hashtags} />

              {/* Label */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: '"DM Sans", sans-serif',
                  color: isSelected ? p.labelActive : 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {LABELS[i]}
              </p>

              {/* Angle */}
              <p
                style={{
                  fontSize: '9.5px',
                  fontFamily: '"DM Sans", sans-serif',
                  color: 'rgba(255,255,255,0.28)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {ANGLES[i]}
              </p>

              {/* Score bar */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{ flex: 1, height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '99px',
                      width: `${score}%`,
                      background: p.bar,
                      transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: '"DM Sans", sans-serif',
                    color: isSelected ? p.labelActive : 'rgba(255,255,255,0.38)',
                  }}
                >
                  {score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}