'use client';

import { Badge } from '@/components/ui/badge';
import { GeneratedPost } from '@/types';

interface PostPreviewProps {
  post: GeneratedPost;
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
      {/* LinkedIn-style header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          You
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Name</p>
          <p className="text-xs text-gray-400">Your Title • Now</p>
        </div>
      </div>

      {/* Post content */}
      <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
        {post.content}
      </div>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.hashtags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* CTA */}
      {post.cta && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-3">
          {post.cta}
        </p>
      )}
    </div>
  );
}
