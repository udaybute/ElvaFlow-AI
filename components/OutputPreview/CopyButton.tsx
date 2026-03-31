'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
        copied
          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 hover:border-white/20',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}
