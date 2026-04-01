'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />

      {/* Top radial depth glow — gives the hero section a lit feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -8%, oklch(0.65 0.22 265 / 10%) 0%, transparent 68%)',
        }}
      />

      {/* ── Animated orbs — main ── */}
      <div
        className="orb orb-1 w-[720px] h-[720px] -top-48 -left-48"
        style={{ background: 'oklch(0.65 0.22 265 / 13%)' }}
      />
      <div
        className="orb orb-2 w-[600px] h-[600px] top-1/2 -right-56"
        style={{ background: 'oklch(0.65 0.22 290 / 10%)' }}
      />
      <div
        className="orb orb-3 w-[520px] h-[520px] bottom-0 left-1/3"
        style={{ background: 'oklch(0.58 0.18 312 / 8%)' }}
      />

      {/* ── Accent orbs for layered depth ── */}
      <div
        className="orb orb-2 w-[360px] h-[360px]"
        style={{
          background: 'oklch(0.62 0.20 248 / 7%)',
          top: '28%',
          left: '40%',
          animationDelay: '-7s',
          animationDuration: '24s',
        }}
      />
      <div
        className="orb orb-3 w-[260px] h-[260px]"
        style={{
          background: 'oklch(0.58 0.22 324 / 6%)',
          bottom: '16%',
          right: '12%',
          animationDelay: '-3s',
          animationDuration: '17s',
        }}
      />

      {/* ── Subtle dot grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.022]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
