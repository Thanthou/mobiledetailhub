/**
 * useImageRotation Hook
 * 
 * A React hook that provides image rotation functionality with fade transitions,
 * auto-rotation, and performance optimizations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type ImageRotationConfig,
  type ImageRotationState,
  type ImageRotationActions,
  getNextImageIndex,
  getPreviousImageIndex,
  preloadImage,
  validateImageRotationConfig
} from './imageRotation';

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
 * Hook for managing image rotation with fade transitions
 */
export const useImageRotation = (config: ImageRotationConfig): UseImageRotationReturn => {
  const {
    images,
    autoRotate = true,
    interval = 7000,
    preloadNext = true,
    pauseOnHover = false
  } = config;

  // Validate configuration
  const { isValid, errors } = validateImageRotationConfig(config);
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const preloadRef = useRef<Set<string>>(new Set());

  // Computed values
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;
  const nextIndex = hasMultipleImages ? getNextImageIndex(currentIndex, totalImages) : 0;

  // Preload next image for smoother transitions
  useEffect(() => {
    if (preloadNext && hasMultipleImages && isValid) {
      const nextImageUrl = images[nextIndex];
      if (nextImageUrl && !preloadRef.current.has(nextImageUrl)) {
        preloadImage(nextImageUrl)
          .then(() => {
            preloadRef.current.add(nextImageUrl);
          })
          .catch((error) => {
            console.warn('Failed to preload image:', error);
          });
      }
    }
  }, [currentIndex, nextIndex, images, preloadNext, hasMultipleImages, isValid]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isValid || !autoRotate || !hasMultipleImages || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => getNextImageIndex(prev, totalImages));
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRotate, interval, hasMultipleImages, isPaused, totalImages, isValid]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Actions
  const next = useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex((prev) => getNextImageIndex(prev, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);

  const previous = useCallback(() => {
    if (!isValid || !hasMultipleImages) return;
    setCurrentIndex((prev) => getPreviousImageIndex(prev, totalImages));
  }, [isValid, hasMultipleImages, totalImages]);

  const goTo = useCallback((index: number) => {
    if (!isValid || index < 0 || index >= totalImages) return;
    setCurrentIndex(index);
  }, [isValid, totalImages]);

  const togglePause = useCallback(() => {
    if (!pauseOnHover) return;
    setIsPaused((prev) => !prev);
  }, [pauseOnHover]);

  const setPaused = useCallback((paused: boolean) => {
    if (!pauseOnHover) return;
    setIsPaused(paused);
  }, [pauseOnHover]);

  return {
    // State
    currentIndex,
    nextIndex,
    isPaused,
    
    // Actions
    next,
    previous,
    goTo,
    togglePause,
    setPaused,
    
    // Computed
    hasMultipleImages,
    totalImages,
    isValid,
    errors
  };
};

/**
 * Hook for handling hover-based pause functionality
 */
export const useImageRotationHover = (
  rotationHook: ReturnType<typeof useImageRotation>
) => {
  const { setPaused } = rotationHook;

  const handleMouseEnter = useCallback(() => {
    setPaused(true);
  }, [setPaused]);

  const handleMouseLeave = useCallback(() => {
    setPaused(false);
  }, [setPaused]);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };
};
