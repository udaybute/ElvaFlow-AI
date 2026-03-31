'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient — adapts to theme */}
      <div className="absolute inset-0 bg-[oklch(0.09_0.02_265)] dark:bg-[oklch(0.09_0.02_265)] light:bg-[oklch(0.97_0.005_265)]" />
      <div className="absolute inset-0 bg-background" />

      {/* Animated orbs */}
      <div
        className="orb orb-1 w-[600px] h-[600px] -top-32 -left-32"
        style={{ background: 'oklch(0.65 0.22 265 / 10%)' }}
      />
      <div
        className="orb orb-2 w-[500px] h-[500px] top-1/2 -right-48"
        style={{ background: 'oklch(0.65 0.22 290 / 8%)' }}
      />
      <div
        className="orb orb-3 w-[400px] h-[400px] bottom-0 left-1/3"
        style={{ background: 'oklch(0.60 0.18 310 / 6%)' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
