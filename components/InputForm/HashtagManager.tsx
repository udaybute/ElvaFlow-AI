'use client';

import { Hash, Star, X } from 'lucide-react';

interface HashtagManagerProps {
  savedHashtags: string[];
  onInsert: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function HashtagManager({ savedHashtags, onInsert, onRemove }: HashtagManagerProps) {
  if (savedHashtags.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
        <Star className="h-3 w-3 text-amber-400/60" />
        Saved Hashtags
        <span className="text-white/20 font-normal normal-case tracking-normal">— click to insert</span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {savedHashtags.map((tag) => (
          <div key={tag} className="group flex items-center gap-0.5 rounded-full border border-amber-500/25 bg-amber-500/10 pl-2 pr-1 py-0.5">
            <button
              onClick={() => onInsert(tag)}
              className="text-[11px] font-medium text-amber-400/80 hover:text-amber-300 flex items-center gap-0.5 transition-colors"
            >
              <Hash className="h-2.5 w-2.5" />
              {tag.replace('#', '')}
            </button>
            <button
              onClick={() => onRemove(tag)}
              className="ml-1 text-amber-400/30 hover:text-amber-400/80 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
