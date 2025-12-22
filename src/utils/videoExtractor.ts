/**
 * Video Extractor Utility - V2
 * Attempts to extract video sources from embed URLs and provides download options
 */

export interface VideoSource {
  server: string;
  embedUrl: string;
  quality?: string;
  extractable: boolean;
  message?: string;
}

export interface DownloadInfo {
  title: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  sources: VideoSource[];
  legalOptions: LegalDownloadOption[];
}

export interface LegalDownloadOption {
  provider: string;
  url: string;
  type: 'purchase' | 'rent' | 'stream';
}

/**
 * Generate embed URLs for different servers
 */
export const getEmbedSources = (
  id: number,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): VideoSource[] => {
  const sources: VideoSource[] = [];

  // Server 1: MultiEmbed
  const multiEmbedUrl = type === 'tv'
    ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
    : `https://multiembed.mov/?video_id=${id}&tmdb=1`;

  sources.push({
    server: 'MultiEmbed',
    embedUrl: multiEmbedUrl,
    extractable: false,
    message: 'DRM protected - open in new tab to access'
  });

  // Server 2: VidSrc
  const vidSrcUrl = type === 'movie'
    ? `https://vidsrc.cc/embed/movie/${id}`
    : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;

  sources.push({
    server: 'VidSrc',
    embedUrl: vidSrcUrl,
    extractable: false,
    message: 'DRM protected - open in new tab to access'
  });

  return sources;
};

/**
 * Get legal download/streaming options from TMDB
 * Note: This requires TMDB watch providers API endpoint
 */
export const getLegalDownloadOptions = async (
  tmdbId: number,
  type: 'movie' | 'tv'
): Promise<LegalDownloadOption[]> => {
  const options: LegalDownloadOption[] = [];

  // Add common legal platforms
  options.push({
    provider: 'TMDB',
    url: `https://www.themoviedb.org/${type}/${tmdbId}`,
    type: 'stream'
  });

  options.push({
    provider: 'JustWatch',
    url: `https://www.justwatch.com/us/${type === 'movie' ? 'movie' : 'tv-show'}/${tmdbId}`,
    type: 'stream'
  });

  return options;
};

/**
 * Attempt to open embed source for manual download
 * Since we can't directly extract from DRM-protected embeds,
 * we open the source in a new window for the user
 */
export const openEmbedSource = (embedUrl: string): void => {
  window.open(embedUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Copy embed URL to clipboard
 */
export const copyEmbedUrl = async (embedUrl: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(embedUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
};

/**
 * Generate download info for a video
 */
export const generateDownloadInfo = async (
  title: string,
  tmdbId: number,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): Promise<DownloadInfo> => {
  const sources = getEmbedSources(tmdbId, type, season, episode);
  const legalOptions = await getLegalDownloadOptions(tmdbId, type);

  return {
    title,
    tmdbId,
    type,
    sources,
    legalOptions
  };
};

/**
 * Create a download trigger (for future use when direct video URLs are available)
 */
export const triggerDownload = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get video quality from stream URL (helper for future use)
 */
export const detectVideoQuality = (url: string): string => {
  if (url.includes('1080') || url.includes('1920')) return '1080p';
  if (url.includes('720') || url.includes('1280')) return '720p';
  if (url.includes('480')) return '480p';
  if (url.includes('360')) return '360p';
  return 'Unknown';
};
