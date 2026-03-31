export function parsePostResponse(raw: string) {
  const hashtagMatch = raw.match(/HASHTAGS:\s*(.+)/);
  const ctaMatch = raw.match(/CTA:\s*(.+)/);
  const hashtags = hashtagMatch
    ? hashtagMatch[1].trim().split(/\s+/).filter((h) => h.startsWith('#'))
    : [];
  const cta = ctaMatch ? ctaMatch[1].trim() : '';
  const content = raw
    .replace(/HASHTAGS:.*$/ms, '')
    .replace(/CTA:.*$/ms, '')
    .trim();
  return { content, hashtags, cta, characterCount: content.length };
}
