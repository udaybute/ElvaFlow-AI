'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Trash2, RotateCcw, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CopyButton } from './OutputPreview/CopyButton';
import { GeneratedPost } from '@/types';
import { clearPostHistory } from '@/lib/utils/storage';

interface PostHistoryProps {
  history: GeneratedPost[];
  onRestore: (post: GeneratedPost) => void;
  onRefresh: () => void;
}

export function PostHistory({ history, onRestore, onRefresh }: PostHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    clearPostHistory();
    onRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          backdropFilter: 'blur(28px) saturate(200%)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Accordion toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
              <History className="h-4 w-4 text-white/50" />
            </div>
            <div>
              <span className="text-sm font-bold text-white/80">Post History</span>
              {history.length > 0 && (
                <span className="ml-2 text-[10px] font-bold bg-white/10 text-white/50 rounded-full px-2 py-0.5">
                  {history.length}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && isOpen && (
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="flex items-center gap-1 text-[11px] font-medium text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-5 pb-5">
                <div className="h-px bg-white/6 mb-4" />
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-8 w-8 text-white/15 mb-2" />
                    <p className="text-sm text-white/30">No posts yet</p>
                    <p className="text-xs text-white/20 mt-0.5">Generated posts appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scroll pr-0.5">
                    {history.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-xl border border-white/8 bg-white/3 p-3.5 space-y-2.5 hover:border-white/15 hover:bg-white/5 transition-all"
                      >
                        <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-2.5 w-2.5 text-white/25" />
                            <span className="text-[10px] text-white/30">
                              {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            {post.score && (
                              <span className={`text-[10px] font-bold tabular-nums ml-1 ${post.score.overall >= 75 ? 'text-green-400' : post.score.overall >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                ↑{post.score.overall}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CopyButton
                              text={`${post.content}\n\n${post.hashtags.join(' ')}`}
                            />
                            <button
                              onClick={() => onRestore(post)}
                              className="flex items-center gap-1 text-[11px] font-medium text-primary/70 hover:text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-lg px-2.5 py-1.5 transition-all"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              Restore
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
