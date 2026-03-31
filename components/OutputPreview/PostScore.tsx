'use client';

import { PostScore as PostScoreType } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, Lightbulb } from 'lucide-react';

interface PostScoreProps {
  score: PostScoreType;
}

function getColor(value: number) {
  if (value >= 75) return { text: 'text-green-400', bg: 'bg-green-500' };
  if (value >= 50) return { text: 'text-amber-400', bg: 'bg-amber-400' };
  return { text: 'text-red-400', bg: 'bg-red-500' };
}

function getLabel(value: number) {
  if (value >= 75) return 'Great';
  if (value >= 50) return 'Good';
  return 'Needs work';
}

// Rule-based tips for each dimension
function getTips(score: PostScoreType): string[] {
  const tips: string[] = [];

  if (score.hook < 75) {
    if (score.hook < 50) {
      tips.push('Start with a bold number or stat — "I made $0 in my first 6 months. Here\'s what changed."');
    } else {
      tips.push('Open with a question or a surprising fact to stop the scroll faster.');
    }
  }

  if (score.readability < 75) {
    if (score.readability < 50) {
      tips.push('Break long paragraphs into 1–2 sentence chunks. White space dramatically improves engagement.');
    } else {
      tips.push('Add a blank line after your hook — it creates visual breathing room and increases read-through rate.');
    }
  }

  if (score.cta < 75) {
    if (score.cta < 50) {
      tips.push('Add a direct CTA at the end: "Drop a 🔥 if this resonated" or "What\'s your take? Comment below."');
    } else {
      tips.push('Make your CTA more specific — ask a single, focused question rather than a generic "thoughts?"');
    }
  }

  if (score.hashtags < 75) {
    if (score.hashtags < 40) {
      tips.push('Add 3–5 relevant hashtags at the end. More than 10 hurts reach on LinkedIn.');
    } else {
      tips.push('Mix broad hashtags (#Leadership) with niche ones (#ProductLedGrowth) for wider but targeted reach.');
    }
  }

  if (score.overall >= 80) {
    tips.push('This post is well-optimised. Publish it in the morning (8–10am) for maximum LinkedIn reach.');
  }

  return tips.slice(0, 3);
}

function ScoreRing({ value }: { value: number }) {
  const c = getColor(value);
  const label = getLabel(value);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={value >= 75 ? 'oklch(0.65 0.22 145)' : value >= 50 ? 'oklch(0.75 0.17 80)' : 'oklch(0.65 0.22 27)'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className={cn('text-2xl font-black tabular-nums leading-none', c.text)}>{value}</div>
      </div>
      <span className={cn('text-[11px] font-semibold', c.text)}>{label}</span>
    </div>
  );
}

function ScoreBar({ label, value, tip }: { label: string; value: number; tip: string }) {
  const c = getColor(value);
  return (
    <div className="space-y-1" title={tip}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/45 font-medium">{label}</span>
        <span className={cn('font-bold tabular-nums', c.text)}>{value}</span>
      </div>
      <div className="h-1 bg-white/6 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', c.bg)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function PostScoreCard({ score }: PostScoreProps) {
  const tips = getTips(score);

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 flex items-center gap-1.5">
        <TrendingUp className="h-3 w-3 text-primary/60" />
        Engagement Score
      </p>

      <div className="flex items-center gap-5">
        <ScoreRing value={score.overall} />
        <div className="flex-1 space-y-2.5">
          <ScoreBar label="Hook strength" value={score.hook} tip="How well the opening line grabs attention" />
          <ScoreBar label="Readability" value={score.readability} tip="Sentence length, line breaks, structure" />
          <ScoreBar label="Call-to-action" value={score.cta} tip="How clearly the post drives engagement" />
          <ScoreBar label="Hashtags" value={score.hashtags} tip="Relevance and count of hashtags" />
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-white/6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-amber-400/60" />
            Improvement tips
          </p>
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-amber-400/60 text-xs mt-0.5 shrink-0">→</span>
              <p className="text-[11px] text-white/45 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
