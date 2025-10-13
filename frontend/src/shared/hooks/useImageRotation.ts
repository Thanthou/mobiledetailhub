import { useCallback,useEffect, useRef, useState } from 'react';

import { 
  getNextImageIndex,
  getPreviousImageIndex,
  type ImageRotationActions,
  type ImageRotationConfig, 
  type ImageRotationState, 
  preloadImages,
  validateImageRotationConfig
} from '@/shared/utils/imageRotation';

export interface UseImageRotationReturn extends ImageRotationState, ImageRotationActions {
  /** Whether the carousel has multiple images */
  hasMultipleImages: boolean;
  /** Total number of images */
  totalImages: number;
  /** Whether the configuration is valid */
  isValid: boolean;
  /** Validation errors if any */
  errors: string[];
}

/**
 * Hook for managing image rotation with automatic transitions
 */
export const useImageRotation = (config: ImageRotationConfig): UseImageRotationReturn => {
  const { images, autoRotate, interval, preloadNext } = config;

  // Validate config
  const { isValid, errors } = validateImageRotationConfig(config);
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [_prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user prefers reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => { mediaQuery.removeEventListener('change', handleChange); };
  }, []);

  // Preload images
  useEffect(() => {
    if (preloadNext && totalImages > 1) {
      void preloadImages(images);
    }
  }, [images, preloadNext, totalImages]);

  // Auto-rotation effect
  useEffect(() => {
    // Disable auto-rotation if invalid or paused
    // NOTE: prefersReducedMotion check disabled for development
    // Re-enable in production by uncommenting: || prefersReducedMotion
    if (!isValid || !autoRotate || !hasMultipleImages || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => getNextImageIndex(prevIndex, totalImages));
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isValid, autoRotate, hasMultipleImages, isPaused, interval, totalImages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Navigation functions
  const next = useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex(prevIndex => getNextImageIndex(prevIndex, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);

  const previous = useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex(prevIndex => getPreviousImageIndex(prevIndex, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);

  const goTo = useCallback((index: number) => {
    if (!isValid || !hasMultipleImages || index < 0 || index >= totalImages) return;
    setCurrentIndex(index);
  }, [isValid, hasMultipleImages, totalImages]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setIsPaused(paused);
  }, []);

  return {
    currentIndex,
    nextIndex: getNextImageIndex(currentIndex, totalImages),
    isPaused,
    hasMultipleImages,
    totalImages,
    isValid,
    errors,
    next,
    previous,
    goTo,
    togglePause,
    setPaused
  };
};

/**
 * Hook for handling hover pause functionality
 */
export const useImageRotationHover = (rotation: UseImageRotationReturn) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Pause rotation on hover
  useEffect(() => {
    if (isHovered && rotation.isValid) {
      rotation.setPaused(true);
    } else {
      rotation.setPaused(false);
    }
  }, [isHovered, rotation]);

  return {
    isHovered,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };
};