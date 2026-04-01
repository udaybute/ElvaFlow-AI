'use client';

import { ImageStyle } from '@/types';

// ── Design tokens ─────────────────────────────────────────────────────────────

type Scheme = {
  bg: string[];
  accent: string;
  accentAlt: string;
  glowMain: string;
  glowAlt: string;
  textColor: string;
  subColor: string;
  tagBg: string;
  tagBorder: string;
  isLight: boolean;
};

const SCHEMES: Record<ImageStyle, Scheme> = {
  professional: {
    bg: ['#050d1a', '#0c1e3c'],
    accent: '#0a66c2',
    accentAlt: '#38bdf8',
    glowMain: 'rgba(10,102,194,0.50)',
    glowAlt: 'rgba(56,189,248,0.20)',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.56)',
    tagBg: 'rgba(10,102,194,0.18)',
    tagBorder: 'rgba(10,102,194,0.40)',
    isLight: false,
  },
  minimal: {
    bg: ['#ffffff', '#f0f4ff'],
    accent: '#1e40af',
    accentAlt: '#60a5fa',
    glowMain: 'rgba(30,64,175,0.07)',
    glowAlt: 'rgba(96,165,250,0.10)',
    textColor: '#090f20',
    subColor: 'rgba(9,15,32,0.50)',
    tagBg: 'rgba(30,64,175,0.07)',
    tagBorder: 'rgba(30,64,175,0.18)',
    isLight: true,
  },
  colorful: {
    bg: ['#3a0764', '#8b0d5a', '#c01850'],
    accent: '#fbbf24',
    accentAlt: '#f97316',
    glowMain: 'rgba(251,191,36,0.40)',
    glowAlt: 'rgba(139,92,246,0.45)',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.74)',
    tagBg: 'rgba(255,255,255,0.13)',
    tagBorder: 'rgba(255,255,255,0.22)',
    isLight: false,
  },
  abstract: {
    bg: ['#03060f', '#080c1c'],
    accent: '#00e5ff',
    accentAlt: '#bf5af2',
    glowMain: 'rgba(0,229,255,0.35)',
    glowAlt: 'rgba(191,90,242,0.30)',
    textColor: '#edfcff',
    subColor: 'rgba(224,244,252,0.54)',
    tagBg: 'rgba(0,229,255,0.10)',
    tagBorder: 'rgba(0,229,255,0.28)',
    isLight: false,
  },
};

// ── Core helpers ──────────────────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

/** Soft radial glow blob */
function drawGlow(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

/** Film-grain noise overlay for premium texture */
function addNoise(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const a = (opacity * 255) | 0;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
}

/** Word-wrap text into lines fitting maxWidth */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
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
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last + '…').width < maxWidth) lines[maxLines - 1] = last + '…';
  }
  return lines;
}

function extractHeadline(content: string): string {
  const first = content.split(/[.\n!?]/)[0].trim();
  return first.length > 80 ? first.slice(0, 77) + '…' : first;
}

function extractSubtitle(content: string): string {
  const parts = content.split(/[.\n!?]/).map(s => s.trim()).filter(Boolean);
  const sub = parts.slice(1, 3).join('. ');
  return sub.length > 130 ? sub.slice(0, 127) + '…' : sub;
}

// ── Background renderers ──────────────────────────────────────────────────────

function drawProfessionalBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  // Deep navy base
  const bg = ctx.createLinearGradient(0, 0, w * 0.5, h);
  bg.addColorStop(0, s.bg[0]);
  bg.addColorStop(1, s.bg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Primary radial glow — top-right
  drawGlow(ctx, w * 0.84, -h * 0.06, 540, s.glowMain);
  // Secondary soft glow — bottom-left
  drawGlow(ctx, w * 0.02, h * 1.02, 360, 'rgba(10,102,194,0.22)');
  // Subtle accent glow on right-center
  drawGlow(ctx, w * 0.82, h * 0.52, 220, s.glowAlt);

  // Dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.055)';
  for (let x = 52; x < w; x += 46) {
    for (let y = 52; y < h; y += 46) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Right-side concentric rings (LinkedIn-style orb)
  const cx = w * 0.81, cy = h * 0.50;
  [240, 175, 115, 65].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(10,102,194,${0.22 - i * 0.04})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Bright arc highlight (partial ring)
  ctx.beginPath();
  ctx.arc(cx, cy, 175, -0.55, 0.55);
  ctx.strokeStyle = 'rgba(56,189,248,0.55)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner dot at ring center
  drawGlow(ctx, cx, cy, 80, 'rgba(10,102,194,0.28)');
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(56,189,248,0.7)';
  ctx.fill();

  // Bottom gradient accent bar
  const lineGrad = ctx.createLinearGradient(0, 0, w * 0.52, 0);
  lineGrad.addColorStop(0, s.accent);
  lineGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = lineGrad;
  roundRect(ctx, 0, h - 5, w * 0.52, 5, 2.5);
  ctx.fill();
}

function drawMinimalBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  // Light base
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, s.bg[0]);
  bg.addColorStop(1, s.bg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Paper grain
  addNoise(ctx, w, h, 0.016);

  // Large hollow ring — geometric anchor top-right
  [220, 155, 96].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(w * 0.865, h * 0.20, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(30,64,175,${0.07 - i * 0.02})`;
    ctx.lineWidth = i === 0 ? 28 : 14;
    ctx.stroke();
  });
  // Ring accent arc
  ctx.beginPath();
  ctx.arc(w * 0.865, h * 0.20, 155, -0.6, 0.5);
  ctx.strokeStyle = 'rgba(30,64,175,0.22)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left vertical accent bar with fade
  const barGrad = ctx.createLinearGradient(0, 72, 0, h - 72);
  barGrad.addColorStop(0, 'transparent');
  barGrad.addColorStop(0.18, s.accent);
  barGrad.addColorStop(0.82, s.accent);
  barGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = barGrad;
  roundRect(ctx, 55, 72, 3, h - 144, 1.5);
  ctx.fill();

  // Top and bottom horizontal rules
  ctx.strokeStyle = 'rgba(30,64,175,0.09)';
  ctx.lineWidth = 1;
  [[72, 72, w - 72, 72], [72, h - 72, w - 72, h - 72]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Mid-rule (subtle)
  ctx.strokeStyle = 'rgba(30,64,175,0.04)';
  ctx.beginPath(); ctx.moveTo(72, h / 2); ctx.lineTo(w - 72, h / 2); ctx.stroke();
}

function drawColorfulBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  // Rich diagonal 3-stop gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, s.bg[0]);
  bg.addColorStop(0.48, s.bg[1]);
  bg.addColorStop(1, s.bg[2] ?? s.bg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Mesh blobs for depth and richness
  drawGlow(ctx, w * 0.10, h * -0.05, 460, 'rgba(139,92,246,0.55)');
  drawGlow(ctx, w * 0.88, h * 0.55, 400, 'rgba(219,39,119,0.45)');
  drawGlow(ctx, w * 0.50, h * 1.08, 360, 'rgba(251,191,36,0.22)');

  // Diagonal stripe texture
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = -h; i < w + h; i += 52) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
  }

  // Large white arc — bottom-right bleed
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 1.35, h * 0.88, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.055)';
  ctx.lineWidth = 55;
  ctx.stroke();

  // Gold 3×3 dot grid — top-right signature
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const isCentre = row === 1 && col === 1;
      ctx.beginPath();
      ctx.arc(w - 96 + col * 30, 58 + row * 30, isCentre ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isCentre ? s.accent : `rgba(251,191,36,${0.35 + (row + col) * 0.1})`;
      ctx.fill();
    }
  }
}

function drawAbstractBg(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  // Near-black base
  ctx.fillStyle = s.bg[0];
  ctx.fillRect(0, 0, w, h);

  // Dual atmospheric glows
  drawGlow(ctx, w * 0.80, -h * 0.10, 560, s.glowMain);
  drawGlow(ctx, -w * 0.06, h * 1.08, 440, s.glowAlt);
  // Subtle inner glow right-center
  drawGlow(ctx, w * 0.78, h * 0.48, 180, 'rgba(0,229,255,0.12)');

  // Flowing wave shapes (layered)
  ctx.beginPath();
  ctx.moveTo(0, h * 0.70);
  ctx.bezierCurveTo(w * 0.24, h * 0.28, w * 0.58, h * 1.02, w, h * 0.52);
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = 'rgba(0,229,255,0.065)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, h * 0.86);
  ctx.bezierCurveTo(w * 0.36, h * 0.52, w * 0.66, h * 1.18, w, h * 0.70);
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = 'rgba(191,90,242,0.07)';
  ctx.fill();

  // Subtle dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.038)';
  for (let x = 64; x < w; x += 42) {
    for (let y = 64; y < h; y += 42) {
      ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Animated-style particle arc along the top
  for (let i = 0; i < 32; i++) {
    const t = i / 31;
    const px = w * 0.28 + t * w * 0.56;
    const py = 48 + Math.sin(t * Math.PI * 1.8) * 24;
    const size = i % 4 === 0 ? 4 : 2;
    const alpha = 0.15 + Math.sin(t * Math.PI) * 0.65;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${alpha.toFixed(2)})`;
    ctx.fill();
  }

  // Radial spokes from glow center
  const gcx = w * 0.80, gcy = -h * 0.10;
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(gcx, gcy);
    ctx.lineTo(gcx + Math.cos(angle) * 680, gcy + Math.sin(angle) * 680);
    ctx.strokeStyle = 'rgba(0,229,255,0.032)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// ── Text layer ────────────────────────────────────────────────────────────────

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

  const PAD = 72;
  const textX = style === 'minimal' ? PAD + 20 : PAD;
  const textMaxW = w * 0.56;

  // ── Brand tag ─────────────────────────────────────────────────────────────
  const tagLabel = 'ELVAFLOW AI';
  ctx.font = `700 12.5px system-ui, -apple-system, sans-serif`;
  const tagTextW = ctx.measureText(tagLabel).width;
  const tagPadX = 14, tagPadY = 8;
  const tagW = tagTextW + tagPadX * 2 + 16; // 16 for dot
  const tagH = 28;
  const tagTop = PAD - 10;

  // Glass pill background
  roundRect(ctx, textX, tagTop, tagW, tagH, tagH / 2);
  ctx.fillStyle = s.tagBg;
  ctx.fill();
  roundRect(ctx, textX, tagTop, tagW, tagH, tagH / 2);
  ctx.strokeStyle = s.tagBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Accent dot
  ctx.beginPath();
  ctx.arc(textX + tagPadX + 4, tagTop + tagH / 2, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = s.accent;
  ctx.fill();

  // Tag text
  ctx.font = `700 12.5px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = s.accent;
  ctx.textAlign = 'left';
  ctx.fillText(tagLabel, textX + tagPadX + 14, tagTop + tagH / 2 + 4.5);

  // ── Divider below tag ─────────────────────────────────────────────────────
  const divY = tagTop + tagH + 20;
  const divGrad = ctx.createLinearGradient(textX, divY, textX + 220, divY);
  divGrad.addColorStop(0, s.isLight ? 'rgba(30,64,175,0.20)' : 'rgba(255,255,255,0.14)');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(textX, divY, 220, 1);

  // ── Headline ──────────────────────────────────────────────────────────────
  const fontSize = headline.length > 58 ? 44 : headline.length > 38 ? 50 : 56;
  ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
  const headLines = wrapText(ctx, headline, textMaxW, 2);
  const lineH = fontSize * 1.20;

  const subtitleH = subtitle ? (34 * Math.min(wrapText(ctx, subtitle, textMaxW, 2).length, 2) + 18) : 0;
  const blockH = headLines.length * lineH + subtitleH + 44;
  let y = Math.max(divY + 36, (h - blockH) / 2 + (style === 'minimal' ? 14 : 0));

  if (!s.isLight) {
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
  }
  headLines.forEach(line => {
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = s.textColor;
    ctx.textAlign = 'left';
    ctx.fillText(line, textX, y);
    y += lineH;
  });
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // ── Gradient accent line ──────────────────────────────────────────────────
  y += 10;
  const accentW = Math.min(ctx.measureText(headLines[0] ?? '').width * 0.45 + 24, 210);
  const accentGrad = ctx.createLinearGradient(textX, y, textX + accentW, y);
  accentGrad.addColorStop(0, s.accent);
  accentGrad.addColorStop(0.6, s.accentAlt);
  accentGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = accentGrad;
  roundRect(ctx, textX, y, accentW, 4, 2);
  ctx.fill();
  y += 22;

  // ── Subtitle ──────────────────────────────────────────────────────────────
  if (subtitle) {
    ctx.font = `400 22px system-ui, -apple-system, sans-serif`;
    const subLines = wrapText(ctx, subtitle, textMaxW, 2);
    subLines.forEach(line => {
      ctx.fillStyle = s.subColor;
      ctx.textAlign = 'left';
      ctx.fillText(line, textX, y);
      y += 34;
    });
  }

  // ── Watermark ─────────────────────────────────────────────────────────────
  ctx.font = `500 13px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = s.isLight ? 'rgba(9,15,32,0.22)' : 'rgba(255,255,255,0.18)';
  ctx.textAlign = 'right';
  ctx.fillText('made with ElvaFlow AI', w - PAD, h - PAD + 42);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateBannerImage(style: ImageStyle, content: string): string {
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const s = SCHEMES[style];

  switch (style) {
    case 'professional': drawProfessionalBg(ctx, W, H, s); break;
    case 'minimal':      drawMinimalBg(ctx, W, H, s);      break;
    case 'colorful':     drawColorfulBg(ctx, W, H, s);     break;
    case 'abstract':     drawAbstractBg(ctx, W, H, s);     break;
  }

  drawTextLayer(ctx, W, H, s, content || 'Your LinkedIn Post', style);

  return canvas.toDataURL('image/jpeg', 0.96);
}
