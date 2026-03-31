'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';
import { GeneratedImage } from '@/types';

interface ImageGridProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

function downloadImage(url: string, id: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `elvaflow-banner-${id}.jpg`;
  a.click();
}

export function ImageGrid({ images, onDelete }: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
        Generated Banners
      </p>
      <div className="grid gap-3">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative group rounded-xl overflow-hidden border border-white/8"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt="AI generated LinkedIn banner"
                className="w-full object-cover"
                style={{ aspectRatio: '1200/630' }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                <button
                  onClick={() => downloadImage(img.url, img.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-all backdrop-blur-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/35 transition-all backdrop-blur-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] font-semibold capitalize bg-black/50 text-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                {img.style}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
