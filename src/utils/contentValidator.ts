import { format, isPast, isFuture, parseISO } from 'date-fns';

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_count?: number;
  vote_average?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  media_type?: string;
  status?: string;
}

export interface ValidationResult {
  isValid: boolean;
  isReleased: boolean;
  hasValidImages: boolean;
  hasMinimumVotes: boolean;
  releaseDate: Date | null;
  daysUntilRelease?: number;
}

/**
 * Validates if content is released and suitable for display
 */
export const validateContent = (
  content: ContentItem,
  minVoteCount: number = 10
): ValidationResult => {
  const releaseDate = getContentReleaseDate(content);
  const isReleased = releaseDate ? isPast(releaseDate) : false;
  const hasValidImages = !!(content.poster_path || content.backdrop_path);
  const hasMinimumVotes = (content.vote_count || 0) >= minVoteCount;

  const daysUntilRelease = releaseDate && isFuture(releaseDate)
    ? Math.ceil((releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : undefined;

  return {
    isValid: isReleased && hasValidImages && hasMinimumVotes,
    isReleased,
    hasValidImages,
    hasMinimumVotes,
    releaseDate,
    daysUntilRelease
  };
};

/**
 * Get the release date from content (movie or TV)
 */
export const getContentReleaseDate = (content: ContentItem): Date | null => {
  const dateString = content.release_date || content.first_air_date;
  if (!dateString) return null;

  try {
    return parseISO(dateString);
  } catch {
    return null;
  }
};

/**
 * Filter array of content to only show released and valid items
 */
export const filterReleasedContent = (
  items: ContentItem[],
  minVoteCount: number = 10
): ContentItem[] => {
  return items.filter(item => {
    const validation = validateContent(item, minVoteCount);
    return validation.isValid;
  });
};

/**
 * Filter array to show only upcoming content
 */
export const filterUpcomingContent = (items: ContentItem[]): ContentItem[] => {
  return items.filter(item => {
    const releaseDate = getContentReleaseDate(item);
    return releaseDate && isFuture(releaseDate) && item.poster_path;
  });
};

/**
 * Filter array to show "coming soon" content - includes both unreleased
 * and recently released content that's likely not available in vidsrc yet
 */
export const filterComingSoonContent = (items: ContentItem[]): ContentItem[] => {
  return items.filter(item => {
    const releaseDate = getContentReleaseDate(item);
    if (!releaseDate || !item.poster_path) return false;
    
    // Include future releases
    if (isFuture(releaseDate)) return true;
    
    // Include recently released content (within 30 days)
    // This content is likely not available in vidsrc yet
    const daysSinceRelease = (new Date().getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRelease < 30;
  });
};

/**
 * Sort content by release date (newest first)
 */
export const sortByReleaseDate = (
  items: ContentItem[],
  order: 'asc' | 'desc' = 'desc'
): ContentItem[] => {
  return [...items].sort((a, b) => {
    const dateA = getContentReleaseDate(a);
    const dateB = getContentReleaseDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return order === 'desc'
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
};

/**
 * Format release date for display
 */
export const formatReleaseDate = (content: ContentItem): string => {
  const date = getContentReleaseDate(content);
  if (!date) return 'TBA';

  if (isPast(date)) {
    return format(date, 'MMM dd, yyyy');
  }

  return `Coming ${format(date, 'MMM dd, yyyy')}`;
};

/**
 * Get release status badge info
 */
export const getReleaseStatus = (content: ContentItem): {
  label: string;
  color: string;
  isReleased: boolean;
} => {
  const releaseDate = getContentReleaseDate(content);

  if (!releaseDate) {
    return { label: 'TBA', color: 'gray', isReleased: false };
  }

  if (isPast(releaseDate)) {
    const daysSinceRelease = Math.ceil((new Date().getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recently released (within 30 days) - likely not available in vidsrc yet
    if (daysSinceRelease < 30) {
      return { label: 'Not Available', color: 'orange', isReleased: true };
    }
    
    // Released long ago - should be available
    return { label: 'Released', color: 'green', isReleased: true };
  }

  const daysUntil = Math.ceil((releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 7) {
    return { label: `${daysUntil}d`, color: 'red', isReleased: false };
  } else if (daysUntil <= 30) {
    return { label: `${daysUntil}d`, color: 'blue', isReleased: false };
  }

  return { label: 'Upcoming', color: 'blue', isReleased: false };
};
