export type PostType =
  | 'thought-leadership'
  | 'personal-story'
  | 'how-to'
  | 'company-update'
  | 'question'
  | 'announcement';

export type PostTone =
  | 'professional'
  | 'conversational'
  | 'inspiring'
  | 'storytelling'
  | 'analytical';

export type PostLength = 'short' | 'medium' | 'long';

export type ImageStyle = 'professional' | 'minimal' | 'colorful' | 'abstract';

export interface GeneratePostRequest {
  topic: string;
  postType: PostType;
  tone: PostTone;
  length: PostLength;
}

export interface PostScore {
  overall: number;      // 0–100
  hook: number;         // opening line strength
  readability: number;  // sentence length, structure
  cta: number;          // call-to-action clarity
  hashtags: number;     // hashtag relevance & count
}

export interface GeneratedPost {
  id: string;
  content: string;
  hashtags: string[];
  cta: string;
  characterCount: number;
  timestamp: number;
  topic: string;
  postType: PostType;
  tone: PostTone;
  score?: PostScore;
}

export interface GenerateImageRequest {
  prompt: string;
  style: ImageStyle;
}

export interface GeneratedImage {
  id: string;
  url: string;
  style: ImageStyle;
  timestamp: number;
}

export interface PostHistory {
  posts: GeneratedPost[];
}

export interface UserPreferences {
  defaultTone: PostTone;
  defaultPostType: PostType;
  defaultLength: PostLength;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarColor: string;
}
