'use client';

import { useState, useRef, useEffect } from 'react';
import { User, X } from 'lucide-react';
import { UserProfile } from '@/types';

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#3b82f6',
  '#10b981', '#f59e0b', '#ef4444', '#06b6d4',
];

interface ProfileSettingsProps {
  profile: UserProfile;
  onChange: (p: Partial<UserProfile>) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export function ProfileSettings({ profile, onChange }: ProfileSettingsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClick);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 transition-all"
        title="Edit profile"
      >
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ background: profile.avatarColor }}
        >
          {getInitials(profile.name)}
        </div>
        <span className="hidden sm:block text-xs font-medium text-white/60 max-w-[80px] truncate">
          {profile.name}
        </span>
        <User className="h-3 w-3 text-white/30" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 z-50 rounded-2xl border border-white/10 bg-[oklch(0.12_0.025_265)] shadow-[0_16px_48px_oklch(0_0_0/50%)] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white/80">Your LinkedIn Profile</h3>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: profile.avatarColor }}
            >
              {getInitials(profile.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">{profile.name || 'Your Name'}</p>
              <p className="text-xs text-white/40">{profile.title || 'Your Title'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Your full name"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/85 placeholder:text-white/25 focus:border-primary/50 focus:outline-none transition-colors"
                maxLength={50}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Your job title"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/85 placeholder:text-white/25 focus:border-primary/50 focus:outline-none transition-colors"
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Avatar Color</label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChange({ avatarColor: color })}
                    className="h-7 w-7 rounded-full transition-all hover:scale-110"
                    style={{
                      background: color,
                      outline: profile.avatarColor === color ? `2px solid white` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/20 text-center">Saved automatically · Only used in the preview</p>
        </div>
      )}
    </div>
  );
}
