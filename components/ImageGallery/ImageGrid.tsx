'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Loader2, Undo2 } from 'lucide-react';
import { GeneratedImage } from '@/types';

interface ImageGridProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const BANNER_ASPECT_RATIO = '1200/630';

function useDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = async (url: string, id: string) => {
    setDownloading(id);
    try {
      const res  = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = href;
      a.download = `banner-${id}.jpg`;
      a.click();
      URL.revokeObjectURL(href);
    } finally {
      setTimeout(() => setDownloading(null), 800);
    }
  };

  return { downloading, download };
}

function useUndoDelete(onDelete: (id: string) => void) {
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);

  const requestDelete = (id: string) => {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timer);
    }
    const timer = setTimeout(() => {
      onDelete(id);
      setPendingDelete(null);
    }, 3500);
    setPendingDelete({ id, timer });
  };

  const cancelDelete = () => {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timer);
      setPendingDelete(null);
    }
  };

  return { pendingDeleteId: pendingDelete?.id ?? null, requestDelete, cancelDelete };
}

export function ImageGrid({ images, onDelete }: ImageGridProps) {
  const { downloading, download }               = useDownload();
  const { pendingDeleteId, requestDelete, cancelDelete } = useUndoDelete(onDelete);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <p
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        Generated Banners
        <span
          style={{
            marginLeft: '8px',
            padding: '2px 8px',
            borderRadius: '20px',
            background: 'rgba(139,92,246,0.18)',
            border: '1px solid rgba(139,92,246,0.30)',
            color: 'rgba(167,139,250,0.9)',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            verticalAlign: 'middle',
          }}
        >
          {images.length}
        </span>
      </p>

      <div className="grid gap-3">
        <AnimatePresence>
          {images.map((img) => {
            const isPendingDelete = pendingDeleteId === img.id;

            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{
                  opacity: isPendingDelete ? 0.4 : 1,
                  scale: isPendingDelete ? 0.98 : 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: isPendingDelete
                    ? '1px solid rgba(248,113,113,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                className="group"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt="AI generated LinkedIn banner"
                  style={{ width: '100%', display: 'block', aspectRatio: BANNER_ASPECT_RATIO, objectFit: 'cover' }}
                />

                {/* Hover overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 50%)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '14px',
                    gap: '8px',
                  }}
                  className="group-hover:opacity-100"
                >
                  {/* Download */}
                  <button
                    onClick={() => download(img.url, img.id)}
                    disabled={downloading === img.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.20)',
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(12px)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: '"DM Sans", sans-serif',
                      cursor: downloading === img.id ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      minHeight: '34px',
                    }}
                  >
                    {downloading === img.id ? (
                      <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Download size={13} />
                    )}
                    {downloading === img.id ? 'Downloading…' : 'Download'}
                  </button>

                  {/* Delete / Undo */}
                  {isPendingDelete ? (
                    <button
                      onClick={cancelDelete}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(251,191,36,0.40)',
                        background: 'rgba(251,191,36,0.15)',
                        backdropFilter: 'blur(12px)',
                        color: 'rgba(253,230,138,1)',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: '"DM Sans", sans-serif',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        minHeight: '34px',
                      }}
                    >
                      <Undo2 size={13} />
                      Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => requestDelete(img.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        border: '1px solid rgba(248,113,113,0.30)',
                        background: 'rgba(248,113,113,0.12)',
                        backdropFilter: 'blur(12px)',
                        color: 'rgba(252,165,165,1)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Style badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: 'rgba(255,255,255,0.70)',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.06em',
                  }}
                >
                  {img.style}
                </div>

                {/* Pending delete countdown bar */}
                {isPendingDelete && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #f87171, #fbbf24)',
                      borderRadius: '0 0 16px 16px',
                      animation: 'shrink 3.5s linear forwards',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}