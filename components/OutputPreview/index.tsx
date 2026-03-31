'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Download, Pencil, Check, X, Hash, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/GlassCard';
import { CopyButton } from './CopyButton';
import { CharCounter } from './CharCounter';
import { PostScoreCard } from './PostScore';
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

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// Live streaming preview with blinking cursor
function StreamingPreview({ contents, progress }: { contents: [string, string, string]; progress: [number, number, number] }) {
  const activeIdx = progress.findIndex((p) => p > 0 && p < 100);
  const liveText = activeIdx >= 0 ? contents[activeIdx] : (contents.find((c) => c.length > 0) ?? '');
  // Strip trailing HASHTAGS/CTA lines from display
  const displayText = liveText.replace(/\nHASHTAGS:.*$/ms, '').replace(/\nCTA:.*$/ms, '').trim();

  return (
    <div className="space-y-4">
      {/* Progress rows */}
      <div className="space-y-2">
        {(['Variation A', 'Variation B', 'Variation C'] as const).map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-white/35 w-20 shrink-0">{label}</span>
            <div className="flex-1 h-1 bg-white/6 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress[i]}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-white/30 w-8 text-right">{progress[i]}%</span>
          </div>
        ))}
      </div>

      {/* Live text */}
      {displayText && (
        <div className="rounded-xl border border-white/8 bg-white/4 p-4 min-h-[120px]">
          <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
            {displayText}
            <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
          </p>
        </div>
      )}
    </div>
  );
}

export function OutputPreview({
  post,
  variations,
  selectedVariation,
  editedContent,
  isEditing,
  isLoading,
  streamingContents,
  variationProgress,
  profile,
  savedHashtags,
  onSelectVariation,
  onEditedContentChange,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onToggleSavedHashtag,
}: OutputPreviewProps) {
  const displayContent = isEditing ? editedContent : (post?.content ?? '');

  function handleCopy() {
    const text = `${displayContent}\n\n${post?.hashtags.join(' ') ?? ''}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  }

  function handleSave() {
    onSaveEdit();
    toast.success('Post updated & saved!');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/90">Generated Post</h3>
              <p className="text-[11px] text-white/35">LinkedIn preview</p>
            </div>
          </div>

          {post && !isEditing && (
            <div className="flex items-center gap-1">
              <CopyButton text={`${displayContent}\n\n${post.hashtags.join(' ')}`} />
              <button
                onClick={onStartEditing}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => exportPostAsPng(post, profile)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all"
                title="Export as PNG card"
              >
                <ImageDown className="h-3 w-3" />
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {isEditing && (
            <div className="flex gap-1.5">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-all"
              >
                <Check className="h-3 w-3" /> Save
              </button>
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="h-px bg-white/6" />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StreamingPreview contents={streamingContents} progress={variationProgress} />
            </motion.div>
          ) : post ? (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <VariationPicker
                variations={variations}
                selected={selectedVariation}
                onSelect={onSelectVariation}
              />

              {/* LinkedIn mock post */}
              <div className="rounded-xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-[0_0_12px_oklch(0.65_0.22_265/30%)]"
                    style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}cc)` }}
                  >
                    {getInitials(profile.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90 leading-none">{profile.name}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{profile.title} · Just now</p>
                  </div>
                </div>

                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => onEditedContentChange(e.target.value)}
                    className="min-h-[160px] text-sm text-white/85 bg-white/5 border-primary/40 leading-relaxed resize-none focus:border-primary/60 rounded-lg"
                    autoFocus
                  />
                ) : (
                  <LinkedInContent content={displayContent} />
                )}

                {post.hashtags.length > 0 && !isEditing && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.hashtags.map((tag) => {
                      const saved = savedHashtags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => onToggleSavedHashtag(tag)}
                          title={saved ? 'Remove from saved' : 'Save hashtag'}
                          className={`inline-flex items-center gap-0.5 text-[11px] font-medium rounded-full px-2 py-0.5 border transition-all ${
                            saved
                              ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                              : 'text-blue-400/80 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
                          }`}
                        >
                          <Hash className="h-2.5 w-2.5" />
                          {tag.replace('#', '')}
                          {saved && <span className="ml-0.5 text-[9px]">★</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {post.cta && !isEditing && (
                  <p className="mt-3 text-xs text-white/30 italic border-t border-white/6 pt-3">
                    {post.cta}
                  </p>
                )}
              </div>

              <CharCounter count={isEditing ? editedContent.length : post.characterCount} />
              {post.score && <PostScoreCard score={post.score} />}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-blue-400/50" />
              </div>
              <p className="text-sm font-semibold text-white/40">Your post will appear here</p>
              <p className="text-xs text-white/25 mt-1">Fill in the form and hit Generate</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

// LinkedIn "see more" fold at ~210 chars
function LinkedInContent({ content }: { content: string }) {
  const FOLD = 210;
  if (content.length <= FOLD) {
    return <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">{content}</p>;
  }

  const above = content.slice(0, FOLD);
  const below = content.slice(FOLD);

  return (
    <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
      {above}
      <span className="text-white/35">
        {'…'}
        <span className="inline-block text-blue-400 cursor-default font-medium ml-1 text-xs">see more</span>
      </span>
      <span className="hidden">{below}</span>
    </p>
  );
}
