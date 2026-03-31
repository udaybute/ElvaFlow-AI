'use client';

import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">Banner Generator</h3>
            <p className="text-[11px] text-white/35">Canvas-rendered LinkedIn banners</p>
          </div>
        </div>

        <div className="h-px bg-white/6" />

        {!postContent.trim() && (
          <p className="text-xs text-white/30 text-center py-2 border border-dashed border-white/10 rounded-lg">
            Generate a post first to create a matching banner
          </p>
        )}

        <ImageGenerator
          prompt={postContent}
          isLoading={isLoading}
          remainingImages={remainingImages}
          onGenerate={onGenerate}
        />
        <ImageGrid images={images} onDelete={onDelete} />
      </GlassCard>
    </motion.div>
  );
}
