'use client';

import { useState } from 'react';
import { ImageIcon, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMAGE_STYLES } from '@/lib/constants';
import { ImageStyle } from '@/types';
import { cn } from '@/lib/utils';

interface ImageGeneratorProps {
  prompt: string;
  isLoading: boolean;
  remainingImages: number;
  onGenerate: (style: ImageStyle) => void;
}

const STYLE_ICONS: Record<string, string> = {
  professional: '🏢',
  minimal: '◽',
  colorful: '🎨',
  abstract: '✦',
};

export function ImageGenerator({ prompt, isLoading, remainingImages, onGenerate }: ImageGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('professional');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35 flex items-center gap-1.5">
          <Wand2 className="h-3 w-3" />
          Banner Style
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {IMAGE_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={cn(
                'rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all duration-200 text-center',
                selectedStyle === style.value
                  ? 'border-primary/60 bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_14px_oklch(0.65_0.22_265/12%)]'
                  : 'border-white/8 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70'
              )}
            >
              <span className="block text-base mb-0.5">{STYLE_ICONS[style.value]}</span>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onGenerate(selectedStyle)}
        disabled={isLoading || !prompt.trim() || remainingImages === 0}
        className="w-full h-10 font-semibold rounded-xl text-sm"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          color: 'white',
          border: 'none',
        }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating banner...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Generate Banner
          </span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${remainingImages > 2 ? 'bg-green-500' : remainingImages > 0 ? 'bg-amber-400' : 'bg-red-500'}`} />
        <p className="text-center text-[11px] text-white/30">
          {remainingImages > 0
            ? `${remainingImages} banner${remainingImages !== 1 ? 's' : ''} remaining this hour`
            : 'Rate limit reached — resets in 1 hour'}
        </p>
      </div>
    </div>
  );
}
