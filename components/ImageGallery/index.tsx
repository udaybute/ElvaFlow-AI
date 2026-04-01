'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageGenerator } from './ImageGenerator';
import { ImageGrid } from './ImageGrid';
import { GeneratedImage, ImageStyle } from '@/types';

interface ImageGalleryProps {
  postContent: string;
  images: GeneratedImage[];
  isLoading: boolean;
  remainingImages: number;
  onGenerate: (style: ImageStyle) => void;
  onDelete: (id: string) => void;
}

export function ImageGallery({
  postContent,
  images,
  isLoading,
  remainingImages,
  onGenerate,
  onDelete,
}: ImageGalleryProps) {
  const hasPost = postContent.trim().length > 0;

  return (
    <>
      {/* Google Font import — add to your _document.tsx or layout.tsx for production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
          {/* ── Header ──────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
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
              <ImageIcon size={18} style={{ color: 'rgba(216,180,254,1)' }} />
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
                Banner Generator
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
                AI-rendered LinkedIn banners
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              marginBottom: '20px',
            }}
          />

          {/* ── Content area ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {!hasPost ? (
              /* Empty state — shown only when no post exists */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 20px',
                  gap: '16px',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <div
                  className="float-icon"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.16), rgba(236,72,153,0.08))',
                    border: '1px solid rgba(139,92,246,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 28px rgba(139,92,246,0.14)',
                  }}
                >
                  <Sparkles size={22} style={{ color: 'rgba(196,167,255,0.75)' }} />
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.48)',
                      fontFamily: '"DM Sans", sans-serif',
                      margin: 0,
                    }}
                  >
                    Generate a post first
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.26)',
                      fontFamily: '"DM Sans", sans-serif',
                      margin: 0,
                      lineHeight: 1.55,
                      maxWidth: '220px',
                    }}
                  >
                    Your banner will be crafted to match the tone and theme of your post.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Generator — only shown when post content exists */
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <ImageGenerator
                  prompt={postContent}
                  isLoading={isLoading}
                  remainingImages={remainingImages}
                  onGenerate={onGenerate}
                />

                {images.length > 0 && (
                  <>
                    <div
                      style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                      }}
                    />
                    <ImageGrid images={images} onDelete={onDelete} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </>
  );
}