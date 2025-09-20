/**
 * Image Rotation and Fade Utilities
 * 
 * Provides reusable functions and hooks for creating image carousels with
 * fade transitions, auto-rotation, and performance optimizations.
 */

export interface ImageRotationConfig {
  /** Array of image URLs to rotate through */
  images: string[];
  /** Whether to auto-rotate images */
  autoRotate?: boolean;
  /** Interval in milliseconds between rotations */
  interval?: number;
  /** Duration of fade transition in milliseconds */
  fadeDuration?: number;
  /** Whether to preload next image for smoother transitions */
  preloadNext?: boolean;
  /** Whether to pause rotation on hover */
  pauseOnHover?: boolean;
}

export interface ImageRotationState {
  /** Current active image index */
  currentIndex: number;
  /** Next image index (for preloading) */
  nextIndex: number;
  /** Whether rotation is currently paused */
  isPaused: boolean;
}

export interface ImageRotationActions {
  /** Go to next image */
  next: () => void;
  /** Go to previous image */
  previous: () => void;
  /** Go to specific image index */
  goTo: (index: number) => void;
  /** Toggle pause state */
  togglePause: () => void;
  /** Set pause state */
  setPaused: (paused: boolean) => void;
}

/**
 * Calculate the next image index in the rotation
 */
export const getNextImageIndex = (currentIndex: number, totalImages: number): number => {
  return (currentIndex + 1) % totalImages;
};

/**
 * Calculate the previous image index in the rotation
 */
export const getPreviousImageIndex = (currentIndex: number, totalImages: number): number => {
  return currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
};

/**
 * Preload an image for smoother transitions
 */
export const preloadImage = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(imageUrls.map(preloadImage));
};

/**
 * Get CSS transition duration string from milliseconds
 */
export const getTransitionDuration = (durationMs: number): string => {
  return `${durationMs}ms`;
};

/**
 * Generate CSS classes for image opacity based on current state
 */
export const getImageOpacityClasses = (
  imageIndex: number,
  currentIndex: number,
  fadeDuration: number = 2000
): string => {
  const isActive = imageIndex === currentIndex;
  const duration = getTransitionDuration(fadeDuration);
  
  return `transition-opacity duration-[${duration}] ${
    isActive ? 'opacity-100' : 'opacity-0'
  }`;
};

/**
 * Generate inline styles for transition duration
 */
export const getTransitionStyles = (durationMs: number): React.CSSProperties => {
  return {
    transitionDuration: getTransitionDuration(durationMs)
  };
};

/**
 * Filter images to only render current and next (for performance)
 */
export const getVisibleImageIndices = (
  currentIndex: number,
  totalImages: number,
  preloadNext: boolean = true
): number[] => {
  if (totalImages <= 1) return [currentIndex];
  
  const indices = [currentIndex];
  if (preloadNext) {
    const nextIndex = getNextImageIndex(currentIndex, totalImages);
    indices.push(nextIndex);
  }
  
  return indices;
};

/**
 * Check if image rotation is valid for the given configuration
 */
export const validateImageRotationConfig = (config: ImageRotationConfig): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!config.images || config.images.length === 0) {
    errors.push('Images array cannot be empty');
  }
  
  if (config.interval && config.interval < 1000) {
    errors.push('Interval should be at least 1000ms for better UX');
  }
  
  if (config.fadeDuration && config.fadeDuration < 100) {
    errors.push('Fade duration should be at least 100ms');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create a debounced function for rotation controls
 */
export const createDebouncedRotation = (
  callback: () => void,
  delay: number = 300
): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

/**
 * Generate accessibility attributes for image carousel
 */
export const getAccessibilityAttributes = (
  currentIndex: number,
  totalImages: number,
  autoRotate: boolean
): Record<string, string | boolean> => {
  return {
    role: 'img',
    'aria-label': `Image ${currentIndex + 1} of ${totalImages}`,
    'aria-live': autoRotate ? 'polite' : 'off',
    'aria-atomic': true
  };
};
