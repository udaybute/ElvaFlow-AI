'use client';

import { POST_TONES, POST_LENGTHS } from '@/lib/constants';
import { PostTone, PostLength } from '@/types';
import { cn } from '@/lib/utils';
import { Mic2, AlignLeft } from 'lucide-react';

interface ToneSelectorProps {
  tone: PostTone;
  length: PostLength;
  onToneChange: (tone: PostTone) => void;
  onLengthChange: (length: PostLength) => void;
}

export function ToneSelector({ tone, length, onToneChange, onLengthChange }: ToneSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
          <Mic2 className="h-3 w-3" />
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {POST_TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => onToneChange(t.value)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                tone === t.value
                  ? 'border-primary/70 bg-primary/20 text-primary shadow-[0_0_12px_oklch(0.65_0.22_265/20%)]'
                  : 'border-white/10 bg-white/3 text-white/50 hover:border-white/25 hover:text-white/80'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
          <AlignLeft className="h-3 w-3" />
          Length
        </label>
        <div className="flex gap-2">
          {POST_LENGTHS.map((l) => (
            <button
              key={l.value}
              onClick={() => onLengthChange(l.value)}
              className={cn(
                'flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200',
                length === l.value
                  ? 'border-primary/70 bg-primary/15 text-primary shadow-[0_0_12px_oklch(0.65_0.22_265/15%)]'
                  : 'border-white/8 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70'
              )}
            >
              {l.label}
              <span className="block text-[10px] mt-0.5 font-normal opacity-60">~{l.chars} chars</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
