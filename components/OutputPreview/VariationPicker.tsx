'use client';

import { GeneratedPost } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles, Star, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface VariationPickerProps {
  variations: GeneratedPost[];
  selected: number;
  onSelect: (i: number) => void;
}

const LABELS = ['Version A', 'Version B', 'Version C'];
const ANGLES = ['Personal angle', 'Data-driven', 'Bold & direct'];
const COLORS = [
  { ring: 'ring-blue-500/50 border-blue-500/50 bg-blue-500/10', label: 'text-blue-400', bar: 'bg-blue-500' },
  { ring: 'ring-violet-500/50 border-violet-500/50 bg-violet-500/10', label: 'text-violet-400', bar: 'bg-violet-500' },
  { ring: 'ring-pink-500/50 border-pink-500/50 bg-pink-500/10', label: 'text-pink-400', bar: 'bg-pink-500' },
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
      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-all h-5 w-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/40 hover:text-white/80"
      title="Copy this variation"
    >
      {copied ? <Check className="h-2.5 w-2.5 text-green-400" /> : <Copy className="h-2.5 w-2.5" />}
    </button>
  );
}

export function VariationPicker({ variations, selected, onSelect }: VariationPickerProps) {
  if (variations.length === 0) return null;

  const bestIdx = variations.reduce(
    (best, vv, ii) => ((vv.score?.overall ?? 0) > (variations[best].score?.overall ?? 0) ? ii : best),
    0
  );

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-primary/60" />
        3 Variations — pick your favourite
      </p>
      <div className="grid grid-cols-3 gap-2">
        {variations.map((v, i) => {
          const score = v.score?.overall ?? 0;
          const isSelected = i === selected;
          const isBest = bestIdx === i;
          const c = COLORS[i];

          return (
            <button
              key={v.id}
              onClick={() => onSelect(i)}
              className={cn(
                'group relative rounded-xl border p-3 text-left transition-all duration-200',
                isSelected
                  ? `${c.ring} ring-1 shadow-[0_0_16px_oklch(0.65_0.22_265/15%)]`
                  : 'border-white/8 bg-white/3 hover:border-white/18 hover:bg-white/5'
              )}
            >
              <VariationCopyBtn content={v.content} hashtags={v.hashtags} />
              {isBest && (
                <span className="absolute -top-2 left-2 flex items-center gap-0.5 text-[9px] bg-amber-500 text-white rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wide">
                  <Star className="h-2 w-2 fill-current" />
                  Best
                </span>
              )}
              <p className={cn('text-[11px] font-bold', isSelected ? c.label : 'text-white/70')}>
                {LABELS[i]}
              </p>
              <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{ANGLES[i]}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1 flex-1 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', c.bar)}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={cn('text-[10px] font-bold tabular-nums', isSelected ? c.label : 'text-white/40')}>
                  {score}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
