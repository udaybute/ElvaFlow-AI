'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2, Wand2, Clock } from 'lucide-react';
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

const Divider = () => (
  <div
    style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
    }}
  />
);

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
  const isRateLimited = remainingPosts === 0;
  const canGenerate   = !isLoading && topic.trim().length > 0 && !isRateLimited;

  const statusColor =
    remainingPosts > 3 ? '#34d399' :
    remainingPosts > 0 ? '#fbbf24' :
    '#f87171';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard
          style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* ── Header ──────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.15))',
                border: '1px solid rgba(139,92,246,0.30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(139,92,246,0.15)',
              }}
            >
              <Wand2 size={17} style={{ color: 'rgba(196,167,255,1)' }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.92)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Create Your Post
              </h3>
              <p
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.38)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  marginTop: '1px',
                }}
              >
                AI generates 3 unique variations
              </p>
            </div>
          </div>

          <Divider />

          {/* ── Form fields ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>

            <TopicInput value={topic} onChange={onTopicChange} />

            {savedHashtags.length > 0 && (
              <HashtagManager
                savedHashtags={savedHashtags}
                onInsert={onInsertHashtag}
                onRemove={onRemoveHashtag}
              />
            )}

            <Divider />
            <TypeSelector value={postType} onChange={onPostTypeChange} />
            <Divider />
            <ToneSelector
              tone={tone}
              length={length}
              onToneChange={onToneChange}
              onLengthChange={onLengthChange}
            />

            {/* ── CTA ───────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
              <button
                onClick={() => canGenerate && onGenerate()}
                disabled={!canGenerate}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: canGenerate ? 'pointer' : 'not-allowed',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  ...(isRateLimited
                    ? {
                        background: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.30)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                    : !canGenerate
                    ? {
                        background: 'rgba(139,92,246,0.15)',
                        color: 'rgba(255,255,255,0.28)',
                      }
                    : {
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
                        color: '#fff',
                        boxShadow: '0 4px 24px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                      }),
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Generating 3 variations…
                  </>
                ) : isRateLimited ? (
                  <>
                    <Clock size={15} />
                    Rate limit reached · resets in 1 hr
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generate Post
                  </>
                )}
              </button>

              {!isRateLimited && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: statusColor,
                      boxShadow: `0 0 6px ${statusColor}`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '11px', fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.40)' }}>
                    {remainingPosts} generation{remainingPosts !== 1 ? 's' : ''} remaining this hour
                  </span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </>
  );
}