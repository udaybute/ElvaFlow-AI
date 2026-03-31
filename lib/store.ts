import { create } from 'zustand';
import {
  GeneratedPost,
  GeneratedImage,
  PostType,
  PostTone,
  PostLength,
  ImageStyle,
  UserProfile,
} from '@/types';
import { savePost, getPostHistory, deletePost, generateId } from '@/lib/utils/storage';
import { postRateLimiter, imageRateLimiter, formatTimeRemaining } from '@/lib/utils/rateLimit';
import { RATE_LIMIT_POSTS_PER_HOUR, RATE_LIMIT_IMAGES_PER_HOUR } from '@/lib/constants';
import { scorePost } from '@/lib/utils/scorePost';
import { parsePostResponse } from '@/lib/utils/parsePostResponse';

interface AppState {
  // Form
  topic: string;
  postType: PostType;
  tone: PostTone;
  length: PostLength;

  // Variations
  variations: GeneratedPost[];
  selectedVariation: number;
  currentPost: GeneratedPost | null;

  // Streaming
  streamingContents: [string, string, string];
  variationProgress: [number, number, number];

  // Editable content
  editedContent: string;
  isEditing: boolean;

  // History & images
  postHistory: GeneratedPost[];
  images: GeneratedImage[];

  // Loading / errors
  isGeneratingPost: boolean;
  isGeneratingImage: boolean;
  postError: string | null;
  imageError: string | null;

  // Rate limits
  remainingPosts: number;
  remainingImages: number;

  // Profile
  profile: UserProfile;

  // Saved hashtags
  savedHashtags: string[];

  // Actions
  setTopic: (v: string) => void;
  setPostType: (v: PostType) => void;
  setTone: (v: PostTone) => void;
  setLength: (v: PostLength) => void;
  setSelectedVariation: (i: number) => void;
  setEditedContent: (v: string) => void;
  setIsEditing: (v: boolean) => void;
  saveEditedContent: () => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  toggleSavedHashtag: (tag: string) => void;
  generatePost: () => Promise<void>;
  generateImage: (style: ImageStyle) => Promise<void>;
  deleteCurrentPost: () => void;
  deleteImage: (id: string) => void;
  loadHistory: () => void;
  refreshRateLimits: () => void;
}

function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return { name: 'Your Name', title: 'Your Title', avatarColor: '#6366f1' };
  try {
    const raw = localStorage.getItem('elvaflow_profile');
    return raw ? JSON.parse(raw) : { name: 'Your Name', title: 'Your Title', avatarColor: '#6366f1' };
  } catch { return { name: 'Your Name', title: 'Your Title', avatarColor: '#6366f1' }; }
}

function loadSavedHashtags(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('elvaflow_hashtags');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const LENGTH_PROGRESS_TARGET: Record<string, number> = { short: 450, medium: 800, long: 1300, xl: 3000 };

function estimateProgress(text: string, length: PostLength): number {
  const target = LENGTH_PROGRESS_TARGET[length] ?? 800;
  return Math.min(Math.round((text.length / target) * 100), 95);
}

export const useAppStore = create<AppState>((set, get) => ({
  topic: '',
  postType: 'thought-leadership',
  tone: 'professional',
  length: 'medium',
  variations: [],
  selectedVariation: 0,
  currentPost: null,
  streamingContents: ['', '', ''],
  variationProgress: [0, 0, 0],
  editedContent: '',
  isEditing: false,
  postHistory: [],
  images: [],
  isGeneratingPost: false,
  isGeneratingImage: false,
  postError: null,
  imageError: null,
  remainingPosts: RATE_LIMIT_POSTS_PER_HOUR,
  remainingImages: RATE_LIMIT_IMAGES_PER_HOUR,
  profile: { name: 'Your Name', title: 'Your Title', avatarColor: '#6366f1' },
  savedHashtags: [],

  setTopic: (topic) => set({ topic }),
  setPostType: (postType) => set({ postType }),
  setTone: (tone) => set({ tone }),
  setLength: (length) => set({ length }),

  setSelectedVariation: (i) => {
    const { variations } = get();
    const post = variations[i] ?? null;
    set({ selectedVariation: i, currentPost: post, editedContent: post?.content ?? '', isEditing: false });
  },

  setEditedContent: (v) => set({ editedContent: v }),
  setIsEditing: (v) => set({ isEditing: v }),

  updateProfile: (p) => {
    const updated = { ...get().profile, ...p };
    if (typeof window !== 'undefined') localStorage.setItem('elvaflow_profile', JSON.stringify(updated));
    set({ profile: updated });
  },

  toggleSavedHashtag: (tag) => {
    const current = get().savedHashtags;
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    if (typeof window !== 'undefined') localStorage.setItem('elvaflow_hashtags', JSON.stringify(next));
    set({ savedHashtags: next });
  },

  saveEditedContent: () => {
    const { currentPost, editedContent } = get();
    if (!currentPost) return;
    const updated: GeneratedPost = {
      ...currentPost,
      content: editedContent,
      characterCount: editedContent.length,
      score: scorePost({ content: editedContent, hashtags: currentPost.hashtags, cta: currentPost.cta }),
    };
    savePost(updated);
    set((state) => ({
      currentPost: updated,
      isEditing: false,
      variations: state.variations.map((v, i) => i === state.selectedVariation ? updated : v),
      postHistory: getPostHistory(),
    }));
  },

  refreshRateLimits: () => {
    set({
      remainingPosts: postRateLimiter.getRemainingRequests(),
      remainingImages: imageRateLimiter.getRemainingRequests(),
      profile: loadProfile(),
      savedHashtags: loadSavedHashtags(),
    });
  },

  loadHistory: () => set({ postHistory: getPostHistory() }),

  generatePost: async () => {
    const { topic, postType, tone, length } = get();

    if (!postRateLimiter.canMakeRequest()) {
      const wait = formatTimeRemaining(postRateLimiter.getTimeUntilReset());
      set({ postError: `Rate limit reached. Try again in ${wait}.` });
      return;
    }

    set({
      isGeneratingPost: true,
      postError: null,
      variations: [],
      currentPost: null,
      streamingContents: ['', '', ''],
      variationProgress: [0, 0, 0],
    });

    const body = (variationIndex: number) =>
      JSON.stringify({ topic, postType, tone, length, variationIndex, stream: true });

    try {
      // Stream all 3 in parallel — accumulate each, update progress live
      const accumulated = ['', '', ''];

      await Promise.all(
        [0, 1, 2].map(async (idx) => {
          const response = await fetch('/api/generate-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body(idx),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error ?? 'Generation failed');
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated[idx] += decoder.decode(value, { stream: true });

            // Live update: streaming text + progress
            set((state) => {
              const sc = [...state.streamingContents] as [string, string, string];
              const vp = [...state.variationProgress] as [number, number, number];
              sc[idx] = accumulated[idx];
              vp[idx] = estimateProgress(accumulated[idx], length);
              return { streamingContents: sc, variationProgress: vp };
            });
          }

          // Mark this variation as 100% done
          set((state) => {
            const vp = [...state.variationProgress] as [number, number, number];
            vp[idx] = 100;
            return { variationProgress: vp };
          });
        })
      );

      // All 3 done — parse + score
      const variations: GeneratedPost[] = accumulated.map((raw) => {
        const parsed = parsePostResponse(raw);
        return {
          id: generateId(),
          content: parsed.content,
          hashtags: parsed.hashtags,
          cta: parsed.cta,
          characterCount: parsed.characterCount,
          timestamp: Date.now(),
          topic,
          postType,
          tone,
          score: scorePost({ content: parsed.content, hashtags: parsed.hashtags, cta: parsed.cta }),
        };
      });

      const bestIdx = variations.reduce(
        (best, v, i) => ((v.score?.overall ?? 0) > (variations[best].score?.overall ?? 0) ? i : best),
        0
      );

      postRateLimiter.recordRequest();
      savePost(variations[bestIdx]);

      set({
        variations,
        selectedVariation: bestIdx,
        currentPost: variations[bestIdx],
        editedContent: variations[bestIdx].content,
        isEditing: false,
        postHistory: getPostHistory(),
        remainingPosts: postRateLimiter.getRemainingRequests(),
      });
    } catch (err) {
      set({ postError: err instanceof Error ? err.message : 'Network error. Please try again.' });
    } finally {
      set({ isGeneratingPost: false });
    }
  },

  generateImage: async (style: ImageStyle) => {
    if (!imageRateLimiter.canMakeRequest()) {
      const wait = formatTimeRemaining(imageRateLimiter.getTimeUntilReset());
      set({ imageError: `Rate limit reached. Try again in ${wait}.` });
      return;
    }

    set({ isGeneratingImage: true, imageError: null });

    try {
      const { currentPost, topic } = get();
      const content = currentPost?.content ?? topic;
      const { generateBannerImage } = await import('@/lib/utils/canvasImage');
      const url = generateBannerImage(style, content);

      imageRateLimiter.recordRequest();

      set((state) => ({
        images: [{ id: generateId(), url, style, timestamp: Date.now() }, ...state.images],
        remainingImages: imageRateLimiter.getRemainingRequests(),
      }));
    } catch {
      set({ imageError: 'Failed to generate image. Please try again.' });
    } finally {
      set({ isGeneratingImage: false });
    }
  },

  deleteCurrentPost: () => {
    const { currentPost } = get();
    if (currentPost) {
      deletePost(currentPost.id);
      set({ currentPost: null, variations: [], postHistory: getPostHistory() });
    }
  },

  deleteImage: (id) =>
    set((state) => ({ images: state.images.filter((img) => img.id !== id) })),
}));
