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
          className="top-accent-line"
          style={{
            padding: '24px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            backdropFilter: 'blur(28px) saturate(200%)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* ── Header ──────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(236,72,153,0.18))',
                border: '1px solid rgba(139,92,246,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 24px rgba(139,92,246,0.22), inset 0 1px 0 rgba(255,255,255,0.10)',
              }}
            >
              <Wand2 size={18} style={{ color: 'rgba(216,180,254,1)' }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.94)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                Create Your Post
              </h3>
              <p
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.40)',
                  fontFamily: '"DM Sans", sans-serif',
                  margin: 0,
                  marginTop: '2px',
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
                className={canGenerate ? 'shimmer-hover' : ''}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  cursor: canGenerate ? 'pointer' : 'not-allowed',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  ...(isRateLimited
                    ? {
                        background: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.28)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                    : !canGenerate
                    ? {
                        background: 'rgba(139,92,246,0.12)',
                        color: 'rgba(255,255,255,0.24)',
                        border: 'none',
                      }
                    : {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 45%, #DB2777 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 28px rgba(139,92,246,0.45), 0 2px 8px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.16)',
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