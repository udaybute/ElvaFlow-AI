'use client';

import { Star, X, Hash } from 'lucide-react';

interface HashtagManagerProps {
  savedHashtags: string[];
  onInsert: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function HashtagManager({ savedHashtags, onInsert, onRemove }: HashtagManagerProps) {
  if (savedHashtags.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <Star size={11} style={{ color: 'rgba(251,191,36,0.75)' }} />
        Saved Hashtags
        <span
          style={{
            fontSize: '10px',
            fontWeight: 400,
            textTransform: 'none',
            letterSpacing: '0',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          — click to insert
        </span>
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {savedHashtags.map((tag) => (
          <div
            key={tag}
            className="group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              borderRadius: '20px',
              border: '1px solid rgba(251,191,36,0.22)',
              background: 'rgba(251,191,36,0.07)',
              paddingLeft: '10px',
              paddingRight: '4px',
              paddingTop: '4px',
              paddingBottom: '4px',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            {/* Insert button — entire tag text is the target */}
            <button
              onClick={() => onInsert(tag)}
              title={`Insert ${tag}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11.5px',
                fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                color: 'rgba(253,224,71,0.80)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                minHeight: '24px', // touch target: supplemented by parent padding
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(253,224,71,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(253,224,71,0.80)')}
            >
              <Hash size={10} />
              {tag.replace(/^#/, '')}
            </button>

            {/* Remove button */}
            <button
              onClick={() => onRemove(tag)}
              title={`Remove ${tag}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'rgba(251,191,36,0.30)',
                cursor: 'pointer',
                marginLeft: '2px',
                transition: 'color 0.15s, background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,113,113,0.90)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(251,191,36,0.30)';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}