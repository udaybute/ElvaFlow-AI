'use client';

import { POST_TYPES } from '@/lib/constants';
import { PostType } from '@/types';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

interface TypeSelectorProps {
  value: PostType;
  onChange: (value: PostType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
        <LayoutGrid className="h-3 w-3" />
        Post Type
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {POST_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={cn(
              'rounded-xl border p-3 text-left transition-all duration-200',
              value === type.value
                ? 'border-primary/70 bg-primary/15 ring-1 ring-primary/40 shadow-[0_0_16px_oklch(0.65_0.22_265/15%)]'
                : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
            )}
          >
            <p className={cn('text-xs font-semibold leading-none', value === type.value ? 'text-primary' : 'text-white/80')}>
              {type.label}
            </p>
            <p className="text-[10px] text-white/35 mt-1 leading-tight">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
