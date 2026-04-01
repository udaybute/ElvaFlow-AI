'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  style?: React.CSSProperties;
}

export function CopyButton({ text, label = 'Copy', style }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '6px 12px',
        minHeight: '32px',
        borderRadius: '10px',
        border: copied
          ? '1px solid rgba(52,211,153,0.40)'
          : '1px solid rgba(255,255,255,0.10)',
        background: copied
          ? 'rgba(52,211,153,0.10)'
          : 'rgba(255,255,255,0.05)',
        color: copied
          ? 'rgba(52,211,153,1)'
          : 'rgba(255,255,255,0.55)',
        fontSize: '11.5px',
        fontWeight: 600,
        fontFamily: '"DM Sans", sans-serif',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.22)';
          (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.85)';
          (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.09)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)';
          (e.currentTarget as HTMLButtonElement).style.color       = 'rgba(255,255,255,0.55)';
          (e.currentTarget as HTMLButtonElement).style.background  = 'rgba(255,255,255,0.05)';
        }
      }}
    >
      {copied
        ? <><Check size={12} /> Copied!</>
        : <><Copy size={12} /> {label}</>
      }
    </button>
  );
}