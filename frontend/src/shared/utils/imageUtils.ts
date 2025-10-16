/**
 * Image optimization utilities for responsive images and WebP conversion
 */

/**
 * Converts image URL to WebP format
 * @param imageUrl - Original image URL
 * @returns WebP version of the image URL
 */
export const toWebp = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  return imageUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp');
};

/**
 * Generates responsive srcSet for WebP images
 * @param imageUrl - Original image URL
 * @param widths - Array of widths to generate
 * @returns WebP srcSet string
 */
export const generateWebpSrcSet = (imageUrl: string, widths: number[]): string => {
  const webpUrl = toWebp(imageUrl);
  return widths.map(width => `${webpUrl} ${width}w`).join(', ');
};

/**
 * Generates responsive srcSet for fallback images
 * @param imageUrl - Original image URL
 * @param widths - Array of widths to generate
 * @returns Fallback srcSet string
 */
export const generateFallbackSrcSet = (imageUrl: string, widths: number[]): string => {
  return widths.map(width => `${imageUrl} ${width}w`).join(', ');
};

/**
 * Generates responsive srcSet (alias for generateFallbackSrcSet for backward compatibility)
 * @param imageUrl - Original image URL
 * @param widths - Array of widths to generate
 * @returns Fallback srcSet string
 */
export const generateSrcSet = (imageUrl: string, widths: number[]): string => {
  return generateFallbackSrcSet(imageUrl, widths);
};

/**
 * Gets responsive image sizes for card components
 * @returns Sizes string for card images
 */
export const getCardImageSizes = (): string => {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

/**
 * Gets responsive image sizes for hero components
 * @returns Sizes string for hero images
 */
export const getHeroImageSizes = (): string => {
  return '(max-width: 1024px) 100vw, 60vw';
};

/**
 * Gets responsive image sizes for service components
 * @returns Sizes string for service images
 */
export const getServiceImageSizes = (): string => {
  return '(max-width: 640px) 100vw, 50vw';
};

/**
 * Common responsive image configurations
 */
export const RESPONSIVE_CONFIGS = {
  // Hero images - large, high priority
  hero: {
    widths: [800, 1200, 1600],
    sizes: '(max-width: 1024px) 100vw, 60vw',
    loading: 'eager' as const,
    decoding: 'sync' as const,
  },
  
  // Service cards - medium priority
  serviceCard: {
    widths: [600, 1200],
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  
  // Content images - medium priority
  content: {
    widths: [500, 800],
    sizes: '(max-width: 640px) 100vw, 50vw',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  
  // Process step images
  process: {
    widths: [600, 800],
    sizes: '(max-width: 640px) 100vw, 50vw',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  
  // Before/after slider images
  slider: {
    widths: [600, 1200],
    sizes: '100vw',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  
  // Profile avatars - small, low priority
  avatar: {
    widths: [64],
    sizes: '64px',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  
  // Icons - very small, low priority
  icon: {
    widths: [20, 32],
    sizes: '20px, 32px',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
} as const;

/**
 * Generates optimized image props for a given configuration
 * @param imageUrl - Original image URL
 * @param config - Responsive configuration
 * @param alt - Alt text
 * @param additionalProps - Additional props to merge
 * @returns Optimized image props
 */
export const generateImageProps = (
  imageUrl: string,
  config: typeof RESPONSIVE_CONFIGS[keyof typeof RESPONSIVE_CONFIGS],
  alt: string,
  additionalProps: Record<string, unknown> = {}
) => {
  const webpSrcSet = generateWebpSrcSet(imageUrl, config.widths);
  const fallbackSrcSet = generateFallbackSrcSet(imageUrl, config.widths);
  
  return {
    alt,
    loading: config.loading,
    decoding: config.decoding,
    srcSet: fallbackSrcSet,
    sizes: config.sizes,
    ...additionalProps,
    // WebP source will be handled by <picture> element
    webpSrcSet,
  };
};

/**
 * Creates a responsive picture element with WebP support
 * @param imageUrl - Original image URL
 * @param config - Responsive configuration
 * @param alt - Alt text
 * @param additionalProps - Additional props for the img element
 * @returns JSX for picture element
 */
export const createResponsivePicture = (
  imageUrl: string,
  config: typeof RESPONSIVE_CONFIGS[keyof typeof RESPONSIVE_CONFIGS],
  alt: string,
  additionalProps: Record<string, unknown> = {}
) => {
  const webpSrcSet = generateWebpSrcSet(imageUrl, config.widths);
  const fallbackSrcSet = generateFallbackSrcSet(imageUrl, config.widths);
  
  return {
    webpSrcSet,
    fallbackSrcSet,
    sizes: config.sizes,
    alt,
    loading: config.loading,
    decoding: config.decoding,
    ...additionalProps,
  };
};