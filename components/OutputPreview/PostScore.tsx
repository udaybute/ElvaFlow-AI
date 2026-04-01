'use client';

import { PostScore as PostScoreType } from '@/types';
import { TrendingUp, Lightbulb } from 'lucide-react';

interface PostScoreProps {
  score: PostScoreType;
}

function getColor(value: number): { text: string; fill: string; glow: string } {
  if (value >= 75) return { text: 'rgba(52,211,153,1)',  fill: 'rgba(52,211,153,1)',  glow: 'rgba(52,211,153,0.25)'  };
  if (value >= 50) return { text: 'rgba(251,191,36,1)',  fill: 'rgba(251,191,36,1)',  glow: 'rgba(251,191,36,0.20)'  };
  return           { text: 'rgba(248,113,113,1)', fill: 'rgba(248,113,113,1)', glow: 'rgba(248,113,113,0.20)' };
}

function getLabel(value: number) {
  if (value >= 75) return 'Great';
  if (value >= 50) return 'Good';
  return 'Needs work';
}

function getTips(score: PostScoreType): string[] {
  const tips: string[] = [];
  if (score.hook < 75)
    tips.push(score.hook < 50
      ? 'Open with a bold stat or confession — e.g. "I made $0 in my first 6 months. Here\'s what changed."'
      : 'Add a blank line after your hook. Visual breathing room increases read-through rate.');
  if (score.readability < 75)
    tips.push(score.readability < 50
      ? 'Break paragraphs into 1–2 sentence chunks. White space dramatically improves engagement.'
      : 'Vary sentence length — short punchy lines followed by a longer one hold attention better.');
  if (score.cta < 75)
    tips.push(score.cta < 50
      ? 'Add a direct CTA: "Drop a 🔥 if this resonated" or "What\'s your take? Comment below."'
      : 'Make your CTA more specific — ask a single focused question, not a generic "thoughts?"');
  if (score.hashtags < 75)
    tips.push(score.hashtags < 40
      ? 'Add 3–5 relevant hashtags. More than 10 hurts reach on LinkedIn.'
      : 'Mix broad (#Leadership) with niche (#ProductLedGrowth) hashtags for targeted reach.');
  if (score.overall >= 80)
    tips.push('Solid post. Publish between 8–10 am on a weekday for maximum LinkedIn reach.');
  return tips.slice(0, 3);
}

function ScoreRing({ value }: { value: number }) {
  const c            = getColor(value);
  const radius       = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset   = circumference - (value / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          viewBox="0 0 64 64"
        >
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={c.fill}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)',
              filter: `drop-shadow(0 0 4px ${c.glow})`,
            }}
          />
        </svg>
        <span
          style={{
            fontSize: '20px',
            fontWeight: 900,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: '"DM Sans", sans-serif',
            color: c.text,
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {value}
        </span>
      </div>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif',
          color: c.text,
          letterSpacing: '0.04em',
        }}
      >
        {getLabel(value)}
      </span>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const c = getColor(value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 500, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.50)' }}>
          {label}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFamily: '"DM Sans", sans-serif', color: c.text }}>
          {value}
        </span>
      </div>
      <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '99px',
            width: `${value}%`,
            background: c.fill,
            transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

export function PostScoreCard({ score }: PostScoreProps) {
  const tips = getTips(score);

  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.025)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <TrendingUp size={12} style={{ color: 'rgba(139,92,246,0.70)' }} />
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
          Engagement Score
        </span>
      </div>

      {/* Ring + bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <ScoreRing value={score.overall} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ScoreBar label="Hook strength"   value={score.hook}        />
          <ScoreBar label="Readability"     value={score.readability} />
          <ScoreBar label="Call-to-action"  value={score.cta}         />
          <ScoreBar label="Hashtags"        value={score.hashtags}    />
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={11} style={{ color: 'rgba(251,191,36,0.65)' }} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.30)',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              Improvement Tips
            </span>
          </div>
          {tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: 'rgba(251,191,36,0.55)', fontSize: '11px', lineHeight: '1.5', flexShrink: 0 }}>→</span>
              <p
                style={{
                  fontSize: '11px',
                  lineHeight: '1.55',
                  color: 'rgba(255,255,255,0.48)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                }}
              >
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}