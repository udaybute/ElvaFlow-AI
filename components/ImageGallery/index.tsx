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
          style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
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
              <ImageIcon size={17} style={{ color: 'rgba(196,167,255,1)' }} />
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
                Banner Generator
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
                  padding: '32px 20px',
                  gap: '10px',
                  border: '1px dashed rgba(255,255,255,0.10)',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} style={{ color: 'rgba(255,255,255,0.20)' }} />
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: '"DM Sans", sans-serif',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  Generate a post first
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: '"DM Sans", sans-serif',
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.5,
                    maxWidth: '220px',
                  }}
                >
                  Your banner will be crafted to match the tone and theme of your post.
                </p>
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