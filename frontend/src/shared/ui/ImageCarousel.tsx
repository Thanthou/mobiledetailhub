/**
 * ImageCarousel Component
 * 
 * A reusable image carousel component that uses the image rotation utilities.
 * This serves as both a standalone component and a reference implementation.
 */

import React, { useMemo } from 'react';

import { useImageRotation, useImageRotationHover } from '@shared/hooks';
import { cn } from '@shared/utils/cn';
import {
  getAccessibilityAttributes,
  getImageOpacityClasses,
  getTransitionStyles,
  getVisibleImageIndices,
  type ImageRotationConfig
} from '@shared/utils/imageRotation';

export interface ImageCarouselProps extends Omit<ImageRotationConfig, 'images'> {
  /** Array of image URLs to display */
  images: string[];
  /** CSS class name for the container */
  className?: string;
  /** CSS class name for individual images */
  imageClassName?: string;
  /** Alt text for images (will be appended with index) */
  altText?: string;
  /** Whether to show navigation dots */
  showDots?: boolean;
  /** Whether to show navigation arrows */
  showArrows?: boolean;
  /** Custom gradient overlay */
  gradientOverlay?: boolean;
  /** Custom gradient classes */
  gradientClassName?: string;
  /** Whether images are decorative (no alt text) */
  decorative?: boolean;
}

/**
 * Reusable Image Carousel Component
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoRotate = true,
  interval = 7000,
  fadeDuration = 2000,
  preloadNext = true,
  pauseOnHover = false,
  className,
  imageClassName,
  altText = 'Carousel image',
  showDots = false,
  showArrows = false,
  gradientOverlay = false,
  gradientClassName = 'bg-gradient-to-t from-black/70 via-black/40 to-black/30',
  decorative = false,
  ...props
}) => {
  const config: ImageRotationConfig = useMemo(() => ({
    images,
    autoRotate,
    interval,
    fadeDuration,
    preloadNext,
    pauseOnHover
  }), [images, autoRotate, interval, fadeDuration, preloadNext, pauseOnHover]);

  const rotation = useImageRotation(config);
  const hoverHandlers = useImageRotationHover(rotation);

  const {
    currentIndex,
    hasMultipleImages,
    totalImages,
    isValid,
    next,
    previous,
    goTo
  } = rotation;

  // Don't render if invalid
  if (!isValid) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-red-500">Invalid image carousel configuration</p>
      </div>
    );
  }

  // Don't render if no images
  if (totalImages === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  // Get visible image indices for performance optimization
  const visibleIndices = getVisibleImageIndices(currentIndex, totalImages, preloadNext);

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      {...(pauseOnHover ? hoverHandlers : {})}
      {...props}
    >
      {/* Images */}
      {images.map((image, index) => {
        // Only render visible images for performance
        if (!visibleIndices.includes(index)) return null;

        return (
          <img
            key={index}
            src={image}
            alt={decorative ? '' : `${altText} ${index + 1}`}
            className={cn(
              'absolute inset-0 w-full h-full object-cover',
              getImageOpacityClasses(index, currentIndex, fadeDuration),
              imageClassName
            )}
            style={getTransitionStyles(fadeDuration)}
            decoding={index === 0 ? 'sync' : 'async'}
            loading={index === 0 ? 'eager' : 'lazy'}
            {...getAccessibilityAttributes(currentIndex, totalImages, autoRotate)}
          />
        );
      })}

      {/* Gradient Overlay */}
      {gradientOverlay && (
        <div className={cn('absolute inset-0', gradientClassName)} />
      )}

      {/* Navigation Arrows */}
      {showArrows && hasMultipleImages && (
        <>
          <button
            onClick={previous}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {Array.from({ length: totalImages }).map((_, index) => (
            <button
              key={index}
              onClick={() => { goTo(index); }}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
