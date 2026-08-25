import type { ModCategory } from '@/types';

/**
 * Format a download/like count number with locale-based thousand separators.
 */
export function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

/**
 * Convert a category slug to its display label.
 */
export function getCategoryLabel(category: ModCategory): string {
  const labels: Record<ModCategory, string> = {
    tools: 'Tools',
    vehicles: 'Vehicles',
    paintjobs: 'Paint Jobs',
    weapons: 'Weapons',
    scripts: 'Scripts',
    player: 'Player',
    maps: 'Maps',
    misc: 'Misc',
  };
  return labels[category] ?? category;
}

/**
 * Build a mod detail page URL.
 * Routes all mod cards directly to the product detail page dynamically.
 */
export function getModUrl(category?: ModCategory | string, slug?: string): string {
  const cat = category || 'paintjobs';
  const slg = slug || 'purple-cat-girl-livery-annis-elegy-rh-7';
  return `/${cat}/${slg}`;
}

/**
 * Build a user profile URL.
 */
export function getUserUrl(username: string): string {
  return `/users/${encodeURIComponent(username)}`;
}

/**
 * Robustly extract YouTube Video ID from any URL variant (youtu.be, watch?v=, embed, shorts, etc.)
 */
export function extractYouTubeVideoId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Reject blob, data, uploads, or typical image/file extensions
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('/uploads/') ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|zip|rar|7z)(\?.*)?$/i.test(trimmed)
  ) {
    return null;
  }

  // youtu.be/<id>
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }

  // youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // youtube.com/embed/<id>
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // youtube.com/live/<id>
  const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i);
  if (liveMatch && liveMatch[1]) {
    return liveMatch[1];
  }

  // Standalone 11-char ID ONLY if not containing slashes or dots
  if (!trimmed.includes('/') && !trimmed.includes('.') && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Get clean privacy-friendly YouTube embed URL for iframes.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1` : null;
}

/**
 * Get YouTube video HQ thumbnail image.
 */
export function getYouTubeThumbnailUrl(url?: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
