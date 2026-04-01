'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Clock } from 'lucide-react';
import { IMAGE_STYLES } from '@/lib/constants';
import { ImageStyle } from '@/types';
import { cn } from '@/lib/utils';

interface ImageGeneratorProps {
  prompt: string;
  isLoading: boolean;
  remainingImages: number;
  onGenerate: (style: ImageStyle) => void;
}

const STYLE_META: Record<string, { icon: string; description: string }> = {
  professional: { icon: '🏢', description: 'Clean & corporate' },
  minimal:      { icon: '◻︎', description: 'Less is more'     },
  colorful:     { icon: '🎨', description: 'Bold & vivid'     },
  abstract:     { icon: '✦',  description: 'Artistic & fluid' },
};

export function ImageGenerator({
  prompt,
  isLoading,
  remainingImages,
  onGenerate,
}: ImageGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('professional');

  const isRateLimited  = remainingImages === 0;
  const isDisabled     = isLoading || !prompt.trim() || isRateLimited;

  const statusColor =
    remainingImages > 2 ? '#34d399' :
    remainingImages > 0 ? '#fbbf24' :
    '#f87171';

  return (
    <div className="space-y-5">

      {/* ── Style selector ─────────────────────────────────── */}
      <div className="space-y-3">
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Banner Style
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {IMAGE_STYLES.map((style) => {
            const meta      = STYLE_META[style.value];
            const isActive  = selectedStyle === style.value;

            return (
              <button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                style={{
                  minHeight: '64px',
                  borderRadius: '14px',
                  border: isActive
                    ? '1px solid rgba(167,139,250,0.55)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: isActive
                    ? 'linear-gradient(145deg, rgba(139,92,246,0.18), rgba(236,72,153,0.10))'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: isActive
                    ? '0 0 20px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : 'none',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
                className={cn('group')}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{meta.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isActive ? 'rgba(216,180,254,1)' : 'rgba(255,255,255,0.60)',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.01em',
                  }}
                >
                  {style.label}
                </span>
                <span
                  style={{
                    fontSize: '9.5px',
                    color: isActive ? 'rgba(216,180,254,0.65)' : 'rgba(255,255,255,0.28)',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.02em',
                  }}
                >
                  {meta.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Generate button ────────────────────────────────── */}
      <button
        onClick={() => !isDisabled && onGenerate(selectedStyle)}
        disabled={isDisabled}
        className={!isDisabled ? 'shimmer-hover' : ''}
        style={{
          width: '100%',
          height: '50px',
          borderRadius: '14px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          overflow: 'hidden',
          ...(isRateLimited
            ? {
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.28)',
                border: '1px solid rgba(255,255,255,0.08)',
              }
            : isDisabled
            ? {
                background: 'rgba(139,92,246,0.12)',
                color: 'rgba(255,255,255,0.24)',
                border: 'none',
              }
            : {
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 45%, #DB2777 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 28px rgba(139,92,246,0.45), 0 2px 8px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.16)',
              }),
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            Generating banner…
          </>
        ) : isRateLimited ? (
          <>
            <Clock size={15} />
            Rate limit reached · resets in 1 hr
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Generate Banner
          </>
        )}
      </button>

      {/* ── Remaining counter ──────────────────────────────── */}
      {!isRateLimited && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {remainingImages} banner{remainingImages !== 1 ? 's' : ''} remaining this hour
          </span>
        </div>
      )}
    </div>
  );
}