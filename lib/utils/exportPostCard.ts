import { GeneratedPost, UserProfile } from '@/types';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function exportPostAsCard(post: GeneratedPost, profile: UserProfile): void {
  const W = 1080;
  const H = 1350; // Portrait card — looks great on mobile/LinkedIn

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0d0f1e');
  bgGrad.addColorStop(0.5, '#0f1220');
  bgGrad.addColorStop(1, '#0b0d1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow top-left
  const glow = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
  glow.addColorStop(0, 'rgba(99,102,241,0.18)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Glow bottom-right
  const glow2 = ctx.createRadialGradient(W - 150, H - 200, 0, W - 150, H - 200, 500);
  glow2.addColorStop(0, 'rgba(139,92,246,0.12)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Card area (white/8%)
  const pad = 64;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 32);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 32);
  ctx.stroke();

  const inner = pad + 40;
  const innerW = W - inner * 2;

  // ── Profile row ───────────────────────────────────────────────────────────
  const avatarR = 36;
  const avatarX = inner + avatarR;
  const avatarY = 160;

  // Avatar circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
  ctx.clip();
  const avatarGrad = ctx.createLinearGradient(avatarX - avatarR, avatarY - avatarR, avatarX + avatarR, avatarY + avatarR);
  avatarGrad.addColorStop(0, profile.avatarColor);
  avatarGrad.addColorStop(1, profile.avatarColor + '99');
  ctx.fillStyle = avatarGrad;
  ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
  ctx.restore();

  // Avatar initials
  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, avatarX, avatarY);

  // Name + title
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(profile.name, avatarX + avatarR + 20, avatarY - 6);

  ctx.font = '22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.fillText(profile.title, avatarX + avatarR + 20, avatarY + 22);

  // ── Divider ───────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(inner, avatarY + 54);
  ctx.lineTo(W - inner, avatarY + 54);
  ctx.stroke();

  // ── Post content ──────────────────────────────────────────────────────────
  const contentY = avatarY + 84;
  const contentLineH = 46;
  const maxContentLines = 14;

  ctx.font = '26px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.82)';

  const paragraphs = post.content.split('\n').filter(Boolean);
  let y = contentY;
  let lineCount = 0;
  let truncated = false;

  outer: for (const para of paragraphs) {
    const lines = wrapText(ctx, para, innerW);
    for (const line of lines) {
      if (lineCount >= maxContentLines) { truncated = true; break outer; }
      ctx.fillStyle = lineCount === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)';
      ctx.fillText(line, inner, y);
      y += contentLineH;
      lineCount++;
    }
    if (lineCount < maxContentLines) { y += 14; } // paragraph gap
  }

  if (truncated) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillText('…see more', inner, y);
    y += contentLineH;
  }

  // ── Hashtags ──────────────────────────────────────────────────────────────
  if (post.hashtags.length > 0) {
    const tagY = Math.max(y + 20, H - 280);
    ctx.font = '22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(96,165,250,0.75)';
    const tagLine = post.hashtags.slice(0, 5).join(' ');
    ctx.fillText(tagLine, inner, tagY);
  }

  // ── Score badge (bottom-right) ────────────────────────────────────────────
  if (post.score) {
    const score = post.score.overall;
    const badgeX = W - inner - 90;
    const badgeY = H - 130;
    const badgeR = 50;

    // Outer ring
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.strokeStyle = score >= 75 ? 'rgba(34,197,94,0.4)' : score >= 50 ? 'rgba(251,191,36,0.4)' : 'rgba(239,68,68,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score}`, badgeX, badgeY - 4);

    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('score', badgeX, badgeY + 18);
  }

  // ── Brand watermark ───────────────────────────────────────────────────────
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  const brandGrad = ctx.createLinearGradient(inner, 0, inner + 200, 0);
  brandGrad.addColorStop(0, '#60a5fa');
  brandGrad.addColorStop(1, '#a78bfa');
  ctx.fillStyle = brandGrad;
  ctx.fillText('ElvaFlow AI', inner, H - 80);

  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText('by Elvatrixa', inner, H - 56);

  // ── Download ──────────────────────────────────────────────────────────────
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elvaflow-card-${post.id}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

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
