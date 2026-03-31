'use client';

import { STORAGE_KEYS, RATE_LIMIT_POSTS_PER_HOUR, RATE_LIMIT_IMAGES_PER_HOUR } from '@/lib/constants';

interface RateLimitEntry {
  timestamps: number[];
}

class RateLimiter {
  private storageKey: string;
  private maxRequests: number;
  private windowMs: number;

  constructor(storageKey: string, maxRequests: number, windowMs = 3600000) {
    this.storageKey = storageKey;
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  private getEntries(): RateLimitEntry {
    if (typeof window === 'undefined') return { timestamps: [] };
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return { timestamps: [] };
    try {
      return JSON.parse(stored);
    } catch {
      return { timestamps: [] };
    }
  }

  private saveEntries(entry: RateLimitEntry): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(entry));
  }

  private cleanOldEntries(entry: RateLimitEntry): RateLimitEntry {
    const now = Date.now();
    return {
      timestamps: entry.timestamps.filter((ts) => now - ts < this.windowMs),
    };
  }

  canMakeRequest(): boolean {
    const entry = this.cleanOldEntries(this.getEntries());
    return entry.timestamps.length < this.maxRequests;
  }

  recordRequest(): void {
    const entry = this.cleanOldEntries(this.getEntries());
    entry.timestamps.push(Date.now());
    this.saveEntries(entry);
  }

  getTimeUntilReset(): number {
    const entry = this.cleanOldEntries(this.getEntries());
    if (entry.timestamps.length === 0) return 0;
    const oldest = Math.min(...entry.timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldest));
  }

  getRemainingRequests(): number {
    const entry = this.cleanOldEntries(this.getEntries());
    return Math.max(0, this.maxRequests - entry.timestamps.length);
  }
}

export const postRateLimiter = new RateLimiter(
  STORAGE_KEYS.POST_RATE_LIMIT,
  RATE_LIMIT_POSTS_PER_HOUR
);

export const imageRateLimiter = new RateLimiter(
  STORAGE_KEYS.IMAGE_RATE_LIMIT,
  RATE_LIMIT_IMAGES_PER_HOUR
);

export function formatTimeRemaining(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
