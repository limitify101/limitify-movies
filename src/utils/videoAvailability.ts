/**
 * Video Availability Checker
 * Checks if a video is available on vidsrc.to before attempting to play
 */

interface AvailabilityResult {
  isAvailable: boolean;
  embedUrl: string;
  error?: string;
}

/**
 * Check if a movie is available on vidsrc.to
 */
export const checkMovieAvailability = async (tmdbId: number): Promise<AvailabilityResult> => {
  const embedUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;

  try {
    // Try to fetch the embed page
    await fetch(embedUrl, {
      method: 'HEAD',
      mode: 'no-cors', // Required for cross-origin requests
    });

    // Note: With no-cors mode, we can't actually read the response status
    // But we can check if the request completed without error
    return {
      isAvailable: true,
      embedUrl,
    };
  } catch (error) {
    return {
      isAvailable: false,
      embedUrl,
      error: 'Failed to check availability',
    };
  }
};

/**
 * Check if a TV show episode is available on vidsrc.to
 */
export const checkTVAvailability = async (
  tmdbId: number,
  season: number,
  episode: number
): Promise<AvailabilityResult> => {
  const embedUrl = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;

  try {
    await fetch(embedUrl, {
      method: 'HEAD',
      mode: 'no-cors',
    });

    return {
      isAvailable: true,
      embedUrl,
    };
  } catch (error) {
    return {
      isAvailable: false,
      embedUrl,
      error: 'Failed to check availability',
    };
  }
};

/**
 * Alternative: Check availability by trying to load iframe
 * This is more reliable but requires DOM manipulation
 */
export const checkAvailabilityViaIframe = (
  embedUrl: string,
  timeout: number = 5000
): Promise<boolean> => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = embedUrl;

    let timeoutId: number;
    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        document.body.removeChild(iframe);
      }
    };

    // If iframe loads successfully, consider it available
    iframe.onload = () => {
      cleanup();
      resolve(true);
    };

    // If iframe fails to load, consider it unavailable
    iframe.onerror = () => {
      cleanup();
      resolve(false);
    };

    // Timeout after specified duration
    timeoutId = window.setTimeout(() => {
      cleanup();
      // If we timeout, assume it's available (better to show than hide)
      resolve(true);
    }, timeout);

    document.body.appendChild(iframe);
  });
};

/**
 * Batch check availability for multiple items
 */
export const checkBatchAvailability = async (
  items: Array<{ id: number; type: 'movie' | 'tv'; season?: number; episode?: number }>
): Promise<Map<number, boolean>> => {
  const results = new Map<number, boolean>();

  const checks = items.map(async (item) => {
    let result: AvailabilityResult;

    if (item.type === 'movie') {
      result = await checkMovieAvailability(item.id);
    } else {
      result = await checkTVAvailability(item.id, item.season || 1, item.episode || 1);
    }

    results.set(item.id, result.isAvailable);
  });

  await Promise.all(checks);
  return results;
};

/**
 * Simple heuristic: Check if content is likely available based on release date
 * This is a fallback when actual availability check fails
 */
export const isLikelyAvailable = (releaseDate: string | null | undefined): boolean => {
  if (!releaseDate) return false;

  const release = new Date(releaseDate);
  const now = new Date();
  const daysSinceRelease = (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24);

  // Content is likely available if it's been released for at least 30 days
  // This gives time for it to appear on streaming services
  return daysSinceRelease >= 30;
};
