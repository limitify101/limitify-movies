import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { API_CONFIG } from '../config/api';

interface OptimizedImageProps {
  path: string | null;
  alt: string;
  type: 'poster' | 'backdrop' | 'profile';
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'original';
  className?: string;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  path,
  alt,
  type,
  size = 'medium',
  className = '',
  fallbackSrc = 'https://placehold.co/500x750/1a1a1a/6b7280?text=No+Image'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '200px'
  });

  const getImageUrl = () => {
    if (!path || hasError) return fallbackSrc;
    const imageSizes = API_CONFIG.TMDB_IMAGE_SIZES[type];
    const sizeKey = size in imageSizes ? imageSizes[size as keyof typeof imageSizes] : imageSizes.medium;
    return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${sizeKey}${path}`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse" />
      )}

      {/* Actual image - only load when in view */}
      {inView && (
        <img
          src={getImageUrl()}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
