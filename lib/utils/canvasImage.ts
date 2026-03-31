'use client';

import { ImageStyle } from '@/types';

type Scheme = {
  bg: [string, string];
  accent: string;
  shape1: string;
  shape2: string;
  textColor: string;
  subTextColor: string;
};

const SCHEMES: Record<ImageStyle, Scheme> = {
  professional: {
    bg: ['#0f2044', '#1a3a6b'],
    accent: '#0a66c2',
    shape1: 'rgba(10,102,194,0.22)',
    shape2: 'rgba(255,255,255,0.05)',
    textColor: '#ffffff',
    subTextColor: 'rgba(255,255,255,0.70)',
  },
  minimal: {
    bg: ['#f8fafc', '#e2e8f0'],
    accent: '#1e40af',
    shape1: 'rgba(30,64,175,0.07)',
    shape2: 'rgba(15,23,42,0.04)',
    textColor: '#0f172a',
    subTextColor: 'rgba(15,23,42,0.55)',
  },
  colorful: {
    bg: ['#7c3aed', '#db2777'],
    accent: '#fbbf24',
    shape1: 'rgba(251,191,36,0.20)',
    shape2: 'rgba(255,255,255,0.10)',
    textColor: '#ffffff',
    subTextColor: 'rgba(255,255,255,0.80)',
  },
  abstract: {
    bg: ['#0f172a', '#1e1b4b'],
    accent: '#06b6d4',
    shape1: 'rgba(6,182,212,0.22)',
    shape2: 'rgba(139,92,246,0.18)',
    textColor: '#ffffff',
    subTextColor: 'rgba(255,255,255,0.65)',
  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function applyGradient(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, s.bg[0]);
  grad.addColorStop(1, s.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/** Wrap text into lines that fit within maxWidth, return array of lines. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = test;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  // Truncate last line with ellipsis if text was cut
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last + '…').width < maxWidth) {
      lines[maxLines - 1] = last + '…';
    }
  }
  return lines;
}

/** Extract a short punchy headline from the first sentence / clause. */
function extractHeadline(content: string): string {
  const first = content.split(/[.\n!?]/)[0].trim();
  return first.length > 72 ? first.slice(0, 69) + '…' : first;
}

/** Extract a subtitle — second sentence / rest of first paragraph. */
function extractSubtitle(content: string): string {
  const parts = content.split(/[.\n!?]/).map((s) => s.trim()).filter(Boolean);
  const sub = parts.slice(1, 3).join('. ');
  return sub.length > 120 ? sub.slice(0, 117) + '…' : sub;
}

// ── background styles ─────────────────────────────────────────────────────────

function drawProfessionalBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  applyGradient(ctx, w, h, s);
  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 70) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 70) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  // Right-side decorative circle
  ctx.beginPath(); ctx.arc(w * 0.9, h * 0.1, 320, 0, Math.PI * 2);
  ctx.fillStyle = s.shape1; ctx.fill();
  // Bottom-left circle
  ctx.beginPath(); ctx.arc(w * 0.08, h * 0.9, 140, 0, Math.PI * 2);
  ctx.fillStyle = s.shape2; ctx.fill();
  // Accent bottom bar
  ctx.fillStyle = s.accent;
  ctx.fillRect(0, h - 6, w * 0.5, 6);
}

function drawMinimalBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  applyGradient(ctx, w, h, s);
  // Horizontal rules
  ctx.strokeStyle = 'rgba(71,85,105,0.10)';
  ctx.lineWidth = 1;
  [90, 200, 360, 470, 555].forEach((y) => {
    ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(w - 80, y); ctx.stroke();
  });
  // Left accent bar
  ctx.fillStyle = s.accent + 'cc';
  ctx.fillRect(60, 80, 5, 470);
  // Corner brackets
  ctx.strokeStyle = s.accent + '44';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(40, 170); ctx.lineTo(40, 40); ctx.lineTo(210, 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w - 40, h - 170); ctx.lineTo(w - 40, h - 40); ctx.lineTo(w - 210, h - 40); ctx.stroke();
  // Soft circle
  ctx.beginPath(); ctx.arc(w * 0.82, h * 0.44, 190, 0, Math.PI * 2);
  ctx.fillStyle = s.shape1; ctx.fill();
}

function drawColorfulBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  applyGradient(ctx, w, h, s);
  [[0.06, 0.88, 340], [0.94, 0.12, 280], [0.50, 1.12, 240]].forEach(([cx, cy, r], i) => {
    ctx.beginPath(); ctx.arc(w * cx, h * cy, r, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? s.shape1 : s.shape2; ctx.fill();
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = -h; i < w + h; i += 50) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.arc(140 + i * 190, 46, 7, 0, Math.PI * 2);
    ctx.fillStyle = s.accent; ctx.fill();
  }
}

function drawAbstractBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  applyGradient(ctx, w, h, s);
  ctx.beginPath();
  ctx.moveTo(0, h * 0.68);
  ctx.bezierCurveTo(w * 0.28, h * 0.22, w * 0.68, h * 0.95, w, h * 0.48);
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = s.shape1; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, h * 0.85);
  ctx.bezierCurveTo(w * 0.42, h * 0.42, w * 0.75, h * 1.08, w, h * 0.65);
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = s.shape2; ctx.fill();
  // Neon dot trail
  for (let i = 0; i < 26; i++) {
    const x = 40 + (i / 25) * (w - 80);
    const y = 52 + Math.sin(i * 0.72) * 28;
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = s.accent; ctx.fill();
  }
  const grd = ctx.createRadialGradient(w * 0.84, h * 0.26, 0, w * 0.84, h * 0.26, 170);
  grd.addColorStop(0, s.accent + '30');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
}

// ── text layer ────────────────────────────────────────────────────────────────

function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: Scheme,
  content: string,
  style: ImageStyle,
) {
  const headline = extractHeadline(content);
  const subtitle = extractSubtitle(content);
  const isLight = style === 'minimal';

  // Text region: left ~62% of width (leave right side for decorative elements)
  const textX = style === 'minimal' ? 100 : 90;
  const textMaxW = w * 0.60;
  const centerY = h / 2;

  // ── Brand tag (top-left) ──────────────────────────────────────────────────
  ctx.font = `600 22px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = s.accent;
  ctx.textAlign = 'left';
  ctx.fillText('ElvaFlow AI', textX, 52);

  // ── Accent pill behind "ElvaFlow AI" ─────────────────────────────────────
  ctx.font = `500 18px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = isLight ? 'rgba(30,64,175,0.10)' : 'rgba(255,255,255,0.10)';
  const pillW = ctx.measureText('ElvaFlow AI').width + 32;
  roundRect(ctx, textX - 10, 30, pillW, 32, 16);
  ctx.fill();
  ctx.font = `700 22px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = s.accent;
  ctx.fillText('ElvaFlow AI', textX, 52);

  // ── Headline ─────────────────────────────────────────────────────────────
  const headlineFontSize = headline.length > 50 ? 48 : 56;
  ctx.font = `800 ${headlineFontSize}px system-ui, -apple-system, sans-serif`;
  const headlineLines = wrapText(ctx, headline, textMaxW, 2);
  const lineH = headlineFontSize * 1.25;
  const totalTextH =
    headlineLines.length * lineH +
    (subtitle ? 16 + 28 * Math.ceil(subtitle.length / 60) : 0);
  let y = centerY - totalTextH / 2 + (style === 'minimal' ? 20 : 0);

  // Shadow for dark backgrounds
  if (!isLight) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
  }

  headlineLines.forEach((line) => {
    ctx.font = `800 ${headlineFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = s.textColor;
    ctx.fillText(line, textX, y);
    y += lineH;
  });

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // ── Accent underline below headline ──────────────────────────────────────
  const underlineW = Math.min(ctx.measureText(headlineLines[0] ?? '').width * 0.5, 180);
  ctx.fillStyle = s.accent;
  ctx.fillRect(textX, y - lineH * 0.1, underlineW, 4);
  y += 24;

  // ── Subtitle ─────────────────────────────────────────────────────────────
  if (subtitle) {
    ctx.font = `400 26px system-ui, -apple-system, sans-serif`;
    const subLines = wrapText(ctx, subtitle, textMaxW, 2);
    subLines.forEach((line) => {
      ctx.fillStyle = s.subTextColor;
      ctx.fillText(line, textX, y);
      y += 36;
    });
  }

  // ── Bottom label ─────────────────────────────────────────────────────────
  ctx.font = `500 18px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = isLight ? 'rgba(15,23,42,0.30)' : 'rgba(255,255,255,0.22)';
  ctx.textAlign = 'right';
  ctx.fillText('by Elvatrixa', w - 30, h - 20);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── public API ────────────────────────────────────────────────────────────────

export function generateBannerImage(style: ImageStyle, content: string): string {
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const s = SCHEMES[style];

  // 1. Background
  switch (style) {
    case 'professional': drawProfessionalBg(ctx, W, H, s); break;
    case 'minimal':      drawMinimalBg(ctx, W, H, s);      break;
    case 'colorful':     drawColorfulBg(ctx, W, H, s);     break;
    case 'abstract':     drawAbstractBg(ctx, W, H, s);     break;
  }

  // 2. Text overlay
  drawTextLayer(ctx, W, H, s, content || 'Your LinkedIn Post', style);

  return canvas.toDataURL('image/jpeg', 0.95);
}
