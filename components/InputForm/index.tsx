'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { TopicInput } from './TopicInput';
import { TypeSelector } from './TypeSelector';
import { ToneSelector } from './ToneSelector';
import { HashtagManager } from './HashtagManager';
import { PostType, PostTone, PostLength } from '@/types';

interface InputFormProps {
  topic: string;
  postType: PostType;
  tone: PostTone;
  length: PostLength;
  isLoading: boolean;
  remainingPosts: number;
  savedHashtags: string[];
  onTopicChange: (v: string) => void;
  onInsertHashtag: (tag: string) => void;
  onRemoveHashtag: (tag: string) => void;
  onPostTypeChange: (v: PostType) => void;
  onToneChange: (v: PostTone) => void;
  onLengthChange: (v: PostLength) => void;
  onGenerate: () => void;
}

export function InputForm({
  topic,
  postType,
  tone,
  length,
  isLoading,
  remainingPosts,
  savedHashtags,
  onTopicChange,
  onInsertHashtag,
  onRemoveHashtag,
  onPostTypeChange,
  onToneChange,
  onLengthChange,
  onGenerate,
}: InputFormProps) {
  const canGenerate = !isLoading && topic.trim().length > 0 && remainingPosts > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard glow className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Wand2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">Create Your Post</h3>
            <p className="text-[11px] text-white/35">AI will generate 3 unique variations</p>
          </div>
        </div>

        <div className="h-px bg-white/6" />

        <TopicInput value={topic} onChange={onTopicChange} />
        <HashtagManager
          savedHashtags={savedHashtags}
          onInsert={onInsertHashtag}
          onRemove={onRemoveHashtag}
        />
        <TypeSelector value={postType} onChange={onPostTypeChange} />
        <ToneSelector
          tone={tone}
          length={length}
          onToneChange={onToneChange}
          onLengthChange={onLengthChange}
        />

        <div className="pt-1 space-y-2">
          <Button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full h-11 btn-gradient text-white font-semibold rounded-xl text-sm disabled:opacity-40"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating 3 variations...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Post
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${remainingPosts > 3 ? 'bg-green-500' : remainingPosts > 0 ? 'bg-amber-400' : 'bg-red-500'}`} />
            <p className="text-center text-[11px] text-white/30">
              {remainingPosts > 0
                ? `${remainingPosts} generation${remainingPosts !== 1 ? 's' : ''} remaining this hour`
                : 'Rate limit reached — resets in 1 hour'}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
