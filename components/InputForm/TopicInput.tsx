'use client';

import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
        <MessageSquare className="h-3 w-3" />
        Topic / Idea
      </label>
      <div className="input-glow rounded-xl">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. I just launched my first SaaS product after 6 months building in public..."
          className="min-h-[108px] resize-none text-sm bg-white/5 border-white/10 text-white/90 placeholder:text-white/25 rounded-xl focus:border-primary/60 focus:bg-white/8 transition-all"
          maxLength={500}
        />
      </div>
      <div className="flex justify-end">
        <span className={`text-[11px] tabular-nums transition-colors ${value.length > 450 ? 'text-amber-400' : 'text-white/25'}`}>
          {value.length}/500
        </span>
      </div>
    </div>
  );
}
