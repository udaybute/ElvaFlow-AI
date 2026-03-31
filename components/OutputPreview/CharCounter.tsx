'use client';

import { LINKEDIN_MAX_CHARS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CharCounterProps {
  count: number;
}

export function CharCounter({ count }: CharCounterProps) {
  const percentage = (count / LINKEDIN_MAX_CHARS) * 100;
  const isWarning = percentage > 80;
  const isOver = count > LINKEDIN_MAX_CHARS;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/35 font-medium uppercase tracking-wide">Characters</span>
        <span className={cn('font-bold tabular-nums', isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white/40')}>
          {count.toLocaleString()} / {LINKEDIN_MAX_CHARS.toLocaleString()}
        </span>
      </div>
      <div className="h-1 bg-white/6 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isOver ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-primary'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
