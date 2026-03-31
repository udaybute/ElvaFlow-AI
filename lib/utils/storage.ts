'use client';

import { GeneratedPost, UserPreferences, PostType, PostTone, PostLength } from '@/types';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '@/lib/constants';

// Post History
export function getPostHistory(): GeneratedPost[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.POST_HISTORY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function savePost(post: GeneratedPost): void {
  if (typeof window === 'undefined') return;
  const history = getPostHistory();
  const updated = [post, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEYS.POST_HISTORY, JSON.stringify(updated));
}

export function deletePost(id: string): void {
  if (typeof window === 'undefined') return;
  const history = getPostHistory().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.POST_HISTORY, JSON.stringify(history));
}

export function clearPostHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.POST_HISTORY);
}

export function exportHistory(): string {
  const history = getPostHistory();
  return JSON.stringify(history, null, 2);
}

// User Preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTone: 'professional',
  defaultPostType: 'thought-leadership',
  defaultLength: 'medium',
};

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  if (!stored) return DEFAULT_PREFERENCES;
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  const current = getUserPreferences();
  localStorage.setItem(
    STORAGE_KEYS.USER_PREFERENCES,
    JSON.stringify({ ...current, ...prefs })
  );
}

// ID generation
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
