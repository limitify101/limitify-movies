// API Configuration
export const API_CONFIG = {
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY || '',
  TMDB_ACCESS_TOKEN: import.meta.env.VITE_TMDB_ACCESS_TOKEN || '',
  TMDB_BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  TMDB_IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      xlarge: 'w780',
      original: 'original'
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original'
    },
    profile: {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
      original: 'original'
    }
  }
};

// Bearer token headers for TMDB API
export const getAuthHeaders = () => ({
  accept: 'application/json',
  Authorization: `Bearer ${API_CONFIG.TMDB_ACCESS_TOKEN}`
});
