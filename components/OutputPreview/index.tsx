'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Pencil, Check, X, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { GlassCard } from '@/components/ui/GlassCard';
import { CopyButton } from './CopyButton';
import { CharCounter } from './CharCounter';
import { PostScoreCard } from './PostScore';
import { PostPreview } from './PostPreview';
import { VariationPicker } from './VariationPicker';
import { GeneratedPost, UserProfile } from '@/types';

interface OutputPreviewProps {
  post: GeneratedPost | null;
  variations: GeneratedPost[];
  selectedVariation: number;
  editedContent: string;
  isEditing: boolean;
  isLoading: boolean;
  streamingContents: [string, string, string];
  variationProgress: [number, number, number];
  profile: UserProfile;
  savedHashtags: string[];
  onSelectVariation: (i: number) => void;
  onEditedContentChange: (v: string) => void;
  onStartEditing: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete?: () => void;
  onToggleSavedHashtag: (tag: string) => void;
}

async function exportPostAsPng(post: GeneratedPost, profile: UserProfile) {
  const { exportPostAsCard } = await import('@/lib/utils/exportPostCard');
  exportPostAsCard(post, profile);
  toast.success('PNG card downloaded!');
}

function StreamingPreview({
  contents,
  progress,
}: {
  contents: [string, string, string];
  progress: [number, number, number];
}) {
  const activeIdx  = progress.findIndex((p) => p > 0 && p < 100);
  const liveText   = activeIdx >= 0 ? contents[activeIdx] : (contents.find((c) => c.length > 0) ?? '');
  const displayText = liveText.replace(/\nHASHTAGS:.*$/ms, '').replace(/\nCTA:.*$/ms, '').trim();
  const LABELS = ['Variation A', 'Variation B', 'Variation C'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LABELS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.35)', width: '76px', flexShrink: 0 }}>
              {label}
            </span>
            <div style={{ flex: 1, height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: '99px', background: 'rgba(139,92,246,1)' }}
                animate={{ width: `${progress[i]}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span style={{ fontSize: '10px', fontVariantNumeric: 'tabular-nums', fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.30)', width: '28px', textAlign: 'right', flexShrink: 0 }}>
              {progress[i]}%
            </span>
          </div>
        ))}
      </div>
      {displayText && (
        <div style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', padding: '14px 16px', minHeight: '120px' }}>
          <p style={{ fontSize: '13px', lineHeight: '1.65', color: 'rgba(255,255,255,0.68)', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'pre-line', margin: 0 }}>
            {displayText}
            <span style={{ display: 'inline-block', width: '2px', height: '14px', background: 'rgba(139,92,246,1)', marginLeft: '2px', borderRadius: '1px', verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
          </p>
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

function ActionBtn({ onClick, title, children, danger }: { onClick: () => void; title?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px 10px', minHeight: '32px', borderRadius: '10px', border: danger ? '1px solid rgba(248,113,113,0.20)' : '1px solid rgba(255,255,255,0.10)', background: danger ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.05)', color: danger ? 'rgba(252,165,165,0.75)' : 'rgba(255,255,255,0.52)', fontSize: '11.5px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', transition: 'all 0.15s ease' }}
      onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.color = danger ? 'rgba(252,165,165,1)' : 'rgba(255,255,255,0.88)'; b.style.background = danger ? 'rgba(248,113,113,0.14)' : 'rgba(255,255,255,0.09)'; b.style.borderColor = danger ? 'rgba(248,113,113,0.40)' : 'rgba(255,255,255,0.22)'; }}
      onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.color = danger ? 'rgba(252,165,165,0.75)' : 'rgba(255,255,255,0.52)'; b.style.background = danger ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.05)'; b.style.borderColor = danger ? 'rgba(248,113,113,0.20)' : 'rgba(255,255,255,0.10)'; }}
    >
      {children}
    </button>
  );
}

const Divider = () => <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />;

export function OutputPreview({
  post, variations, selectedVariation, editedContent, isEditing, isLoading,
  streamingContents, variationProgress, profile, savedHashtags,
  onSelectVariation, onEditedContentChange, onStartEditing, onSaveEdit,
  onCancelEdit, onDelete, onToggleSavedHashtag,
}: OutputPreviewProps) {
  const displayContent = isEditing ? editedContent : (post?.content ?? '');

  function handleSave() { onSaveEdit(); toast.success('Post updated & saved!'); }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&display=swap');`}</style>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
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

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(135deg, rgba(59,130,246,0.28), rgba(96,165,250,0.14))', border: '1px solid rgba(96,165,250,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 24px rgba(59,130,246,0.20), inset 0 1px 0 rgba(255,255,255,0.10)' }}>
                <FileText size={18} style={{ color: 'rgba(147,197,253,1)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255,255,255,0.94)', fontFamily: '"DM Sans", sans-serif', margin: 0, lineHeight: 1.3, letterSpacing: '-0.01em' }}>Generated Post</h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', fontFamily: '"DM Sans", sans-serif', margin: 0, marginTop: '2px' }}>LinkedIn preview</p>
              </div>
            </div>

            {post && !isEditing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CopyButton text={`${displayContent}\n\n${post.hashtags.join(' ')}`} />
                <ActionBtn onClick={onStartEditing} title="Edit post"><Pencil size={13} /> Edit</ActionBtn>
                <ActionBtn onClick={() => exportPostAsPng(post, profile)} title="Export as PNG"><ImageDown size={13} /></ActionBtn>
                {onDelete && <ActionBtn onClick={onDelete} danger title="Delete post"><Trash2 size={13} /></ActionBtn>}
              </div>
            )}

            {isEditing && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', minHeight: '32px', borderRadius: '10px', border: '1px solid rgba(52,211,153,0.40)', background: 'rgba(52,211,153,0.12)', color: 'rgba(52,211,153,1)', fontSize: '11.5px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
                  <Check size={13} /> Save
                </button>
                <ActionBtn onClick={onCancelEdit}><X size={13} /> Cancel</ActionBtn>
              </div>
            )}
          </div>

          <Divider />

          {/* Body */}
          <div style={{ marginTop: '20px' }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StreamingPreview contents={streamingContents} progress={variationProgress} />
                </motion.div>
              ) : post ? (
                <motion.div key={post.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <VariationPicker variations={variations} selected={selectedVariation} onSelect={onSelectVariation} />
                  <PostPreview post={post} profile={profile} isEditing={isEditing} editedContent={editedContent} savedHashtags={savedHashtags} onEditedContentChange={onEditedContentChange} onToggleSavedHashtag={onToggleSavedHashtag} />
                  <CharCounter count={isEditing ? editedContent.length : post.characterCount} />
                  {post.score && <PostScoreCard score={post.score} />}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '52px 20px', textAlign: 'center', gap: '18px' }}>
                  {/* Floating icon */}
                  <div className="float-icon" style={{
                    width: '68px', height: '68px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(96,165,250,0.06))',
                    border: '1px solid rgba(96,165,250,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 32px rgba(59,130,246,0.12)',
                  }}>
                    <FileText size={28} style={{ color: 'rgba(96,165,250,0.55)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.48)', fontFamily: '"DM Sans", sans-serif', margin: 0, letterSpacing: '-0.01em' }}>Your post will appear here</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.26)', fontFamily: '"DM Sans", sans-serif', margin: 0, lineHeight: 1.5 }}>Fill in the topic &amp; settings, then hit Generate</p>
                  </div>
                  {/* Steps breadcrumb */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    {['Topic', 'Type', 'Tone', 'Generate'].map((step, i) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.25)', padding: '3px 9px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}>{step}</span>
                        {i < 3 && <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)' }}>→</span>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </GlassCard>
      </motion.div>
    </>
  );
}