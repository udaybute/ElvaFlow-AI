'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = false, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl',
        'shadow-[0_8px_32px_oklch(0_0_0/32%),inset_0_1px_0_oklch(1_0_0/8%)]',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_16px_48px_oklch(0_0_0/40%)]',
        glow && 'shadow-[0_8px_32px_oklch(0_0_0/32%),inset_0_1px_0_oklch(1_0_0/8%),0_0_40px_oklch(0.65_0.22_265/8%)]',
        className
      )}
    >
      {children}
    </div>
  );
}
