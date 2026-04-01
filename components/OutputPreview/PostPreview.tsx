'use client';

import { useState } from 'react';
import { Hash } from 'lucide-react';
import { GeneratedPost, UserProfile } from '@/types';

interface PostPreviewProps {
  post: GeneratedPost;
  profile: UserProfile;
  isEditing?: boolean;
  editedContent?: string;
  savedHashtags?: string[];
  onEditedContentChange?: (v: string) => void;
  onToggleSavedHashtag?: (tag: string) => void;
}

const FOLD = 210;

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function LinkedInContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  if (content.length <= FOLD) {
    return (
      <p
        style={{
          fontSize: '13px',
          lineHeight: '1.65',
          color: 'rgba(255,255,255,0.82)',
          whiteSpace: 'pre-line',
          fontFamily: '"DM Sans", sans-serif',
          margin: 0,
        }}
      >
        {content}
      </p>
    );
  }

  return (
    <p
      style={{
        fontSize: '13px',
        lineHeight: '1.65',
        color: 'rgba(255,255,255,0.82)',
        whiteSpace: 'pre-line',
        fontFamily: '"DM Sans", sans-serif',
        margin: 0,
      }}
    >
      {expanded ? (
        content
      ) : (
        <>
          {content.slice(0, FOLD)}
          <span style={{ color: 'rgba(255,255,255,0.30)' }}>…</span>
          <button
            onClick={() => setExpanded(true)}
            style={{
              marginLeft: '4px',
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'rgba(96,165,250,0.90)',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"DM Sans", sans-serif',
              cursor: 'pointer',
            }}
          >
            see more
          </button>
        </>
      )}
    </p>
  );
}

export function PostPreview({
  post,
  profile,
  isEditing,
  editedContent,
  savedHashtags = [],
  onEditedContentChange,
  onToggleSavedHashtag,
}: PostPreviewProps) {
  const displayContent = isEditing && editedContent !== undefined ? editedContent : post.content;

  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Profile row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}99)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            fontFamily: '"DM Sans", sans-serif',
            color: '#fff',
            flexShrink: 0,
            boxShadow: `0 0 12px ${profile.avatarColor}44`,
          }}
        >
          {getInitials(profile.name)}
        </div>
        <div>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.90)',
              fontFamily: '"DM Sans", sans-serif',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {profile.name}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: '"DM Sans", sans-serif',
              margin: 0,
              marginTop: '2px',
            }}
          >
            {profile.title} · Just now
          </p>
        </div>
      </div>

      {/* Post content / textarea */}
      {isEditing && onEditedContentChange ? (
        <textarea
          value={editedContent}
          onChange={(e) => onEditedContentChange(e.target.value)}
          autoFocus
          style={{
            minHeight: '160px',
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.40)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '13px',
            lineHeight: '1.65',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: '"DM Sans", sans-serif',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <LinkedInContent content={displayContent} />
      )}

      {/* Hashtags */}
      {post.hashtags.length > 0 && !isEditing && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {post.hashtags.map((tag) => {
            const saved = savedHashtags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggleSavedHashtag?.(tag)}
                title={saved ? 'Remove from saved' : 'Save hashtag'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: saved
                    ? '1px solid rgba(251,191,36,0.35)'
                    : '1px solid rgba(96,165,250,0.25)',
                  background: saved
                    ? 'rgba(251,191,36,0.10)'
                    : 'rgba(59,130,246,0.08)',
                  color: saved
                    ? 'rgba(253,230,138,0.90)'
                    : 'rgba(147,197,253,0.85)',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Hash size={10} />
                {tag.replace(/^#/, '')}
                {saved && (
                  <span style={{ marginLeft: '2px', fontSize: '9px' }}>★</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* CTA */}
      {post.cta && !isEditing && (
        <p
          style={{
            fontSize: '11.5px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.30)',
            fontFamily: '"DM Sans", sans-serif',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '10px',
            margin: 0,
          }}
        >
          {post.cta}
        </p>
      )}
    </div>
  );
}