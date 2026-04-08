/**
 * Convert any YouTube URL format to an embed URL.
 * Handles youtu.be/ID, youtube.com/watch?v=ID, and youtube.com/embed/ID.
 * @param url - YouTube URL in any format
 * @returns Embed URL or undefined if not a valid YouTube URL
 */
export function toEmbedUrl(url: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.has('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      }
      if (u.pathname.startsWith('/embed/')) {
        return url;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}
