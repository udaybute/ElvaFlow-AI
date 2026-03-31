'use client';

import { useState, useRef, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['⌘', 'Enter'], label: 'Generate post' },
  { keys: ['E'], label: 'Edit current post' },
  { keys: ['C'], label: 'Copy current post' },
  { keys: ['Esc'], label: 'Cancel editing' },
  { keys: ['1'], label: 'Select Version A' },
  { keys: ['2'], label: 'Select Version B' },
  { keys: ['3'], label: 'Select Version C' },
];

export function KeyboardHints() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-white/10 bg-[oklch(0.12_0.025_265)] shadow-[0_16px_48px_oklch(0_0_0/50%)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Shortcuts</h3>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {SHORTCUTS.map(({ keys, label }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-white/45">{label}</span>
                <div className="flex items-center gap-1">
                  {keys.map((k) => (
                    <kbd
                      key={k}
                      className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded text-[10px] font-bold bg-white/8 border border-white/12 text-white/50"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
