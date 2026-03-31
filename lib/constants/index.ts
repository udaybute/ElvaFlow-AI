import { PostType, PostTone, PostLength, ImageStyle } from '@/types';

export const POST_TYPES: { value: PostType; label: string; description: string }[] = [
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Share your expertise' },
  { value: 'personal-story', label: 'Personal Story', description: 'Connect authentically' },
  { value: 'how-to', label: 'How-To Guide', description: 'Educate your audience' },
  { value: 'company-update', label: 'Company Update', description: 'Share milestones' },
  { value: 'question', label: 'Question', description: 'Drive engagement' },
  { value: 'announcement', label: 'Announcement', description: 'Big news to share' },
];

export const POST_TONES: { value: PostTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'analytical', label: 'Analytical' },
];

export const POST_LENGTHS: { value: PostLength; label: string; chars: number }[] = [
  { value: 'short', label: 'Short', chars: 300 },
  { value: 'medium', label: 'Medium', chars: 600 },
  { value: 'long', label: 'Long', chars: 1000 },
];

export const IMAGE_STYLES: { value: ImageStyle; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'colorful', label: 'Colorful' },
  { value: 'abstract', label: 'Abstract' },
];

export const LINKEDIN_MAX_CHARS = 3000;
export const MAX_HISTORY_ITEMS = 50;
export const RATE_LIMIT_POSTS_PER_HOUR = 10;
export const RATE_LIMIT_IMAGES_PER_HOUR = 5;

export const STORAGE_KEYS = {
  POST_HISTORY: 'elvaflow_history',
  USER_PREFERENCES: 'elvaflow_preferences',
  POST_RATE_LIMIT: 'elvaflow_post_rl',
  IMAGE_RATE_LIMIT: 'elvaflow_image_rl',
} as const;
