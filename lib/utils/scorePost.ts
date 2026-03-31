import { PostScore, GeneratedPost } from '@/types';

// High-performing LinkedIn hook patterns
const HOOK_PATTERNS = [
  /^(i |i')/i,               // personal "I" openers
  /\?/,                       // questions
  /^\d+\s/,                   // numbered lists
  /nobody|secret|truth|honest|unpopular|wrong|mistake|lesson/i,
  /years? (ago|later|of)/i,
  /stop |don't |never |always /i,
  /:\s*$/m,                   // ends first line with colon (list intro)
  /\.\.\./,                   // ellipsis (curiosity gap)
  /just |only |simple|single/i,
];

const WEAK_HOOK_PATTERNS = [
  /^(today|this|in this|let me|here is|here are|as a|as an)/i,
  /^(i am|i'm) (excited|happy|pleased|thrilled)/i,
  /^we are|^we're/i,
];

function scoreHook(content: string): number {
  const firstLine = content.split('\n')[0].trim();
  let score = 50;

  // Reward strong patterns
  for (const p of HOOK_PATTERNS) {
    if (p.test(firstLine)) { score += 12; break; }
  }
  // Penalise weak openers
  for (const p of WEAK_HOOK_PATTERNS) {
    if (p.test(firstLine)) { score -= 20; break; }
  }
  // Short punchy first line is better
  if (firstLine.length < 60) score += 10;
  else if (firstLine.length > 120) score -= 10;

  return Math.min(100, Math.max(0, score));
}

function scoreReadability(content: string): number {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  if (sentences.length === 0) return 40;

  const avgLen = sentences.reduce((a, s) => a + s.trim().split(/\s+/).length, 0) / sentences.length;

  let score = 70;

  // Ideal avg sentence length: 10–18 words
  if (avgLen >= 10 && avgLen <= 18) score += 20;
  else if (avgLen < 6 || avgLen > 28) score -= 20;

  // Line breaks = visual breathing room
  const lineBreaks = (content.match(/\n/g) ?? []).length;
  if (lineBreaks >= 3) score += 10;
  else if (lineBreaks === 0) score -= 15;

  // Emoji usage (moderate = good, none or excessive = neutral/bad)
  const emojiCount = (content.match(/\p{Emoji}/gu) ?? []).length;
  if (emojiCount >= 1 && emojiCount <= 8) score += 5;
  else if (emojiCount > 12) score -= 5;

  return Math.min(100, Math.max(0, score));
}

function scoreCTA(cta: string, content: string): number {
  if (!cta && !content) return 30;
  const text = (cta + ' ' + content).toLowerCase();

  const ctaKeywords = [
    'comment', 'share', 'follow', 'like', 'save', 'tag',
    'dm', 'reach out', 'let me know', 'what do you think',
    'drop a', 'tell me', 'join', 'subscribe', 'connect',
  ];

  let score = 40;
  for (const kw of ctaKeywords) {
    if (text.includes(kw)) { score += 30; break; }
  }

  // Question mark in CTA is a soft CTA
  if (cta.includes('?') || content.slice(-200).includes('?')) score += 15;

  return Math.min(100, Math.max(0, score));
}

function scoreHashtags(hashtags: string[]): number {
  const count = hashtags.length;
  if (count === 0) return 20;

  let score = 50;

  // LinkedIn sweet spot: 3–5 hashtags
  if (count >= 3 && count <= 5) score += 40;
  else if (count === 1 || count === 2) score += 20;
  else if (count > 8) score -= 20;

  // Penalise generic single-word hashtags only
  const generic = ['#linkedin', '#post', '#update', '#share'];
  const genericCount = hashtags.filter((h) => generic.includes(h.toLowerCase())).length;
  score -= genericCount * 8;

  return Math.min(100, Math.max(0, score));
}

export function scorePost(post: Pick<GeneratedPost, 'content' | 'hashtags' | 'cta'>): PostScore {
  const hook = scoreHook(post.content);
  const readability = scoreReadability(post.content);
  const cta = scoreCTA(post.cta, post.content);
  const hashtags = scoreHashtags(post.hashtags);
  const overall = Math.round(hook * 0.35 + readability * 0.25 + cta * 0.25 + hashtags * 0.15);

  return { overall, hook, readability, cta, hashtags };
}
