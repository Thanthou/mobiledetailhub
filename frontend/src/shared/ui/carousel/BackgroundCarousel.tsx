import React from 'react';

import { useImageRotation } from '@shared/hooks';
import { getImageOpacityClasses, getTransitionStyles,getVisibleImageIndices } from '@shared/utils';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  altText?: string;
}

const BackgroundCarousel: React.FC<BackgroundCarouselProps & React.HTMLAttributes<HTMLDivElement>> = ({
  images,
  interval = 8000,
  className = '',
  overlay = true,
  overlayOpacity = 0.7,
  altText = 'Background image',
  ...rest
}) => {
  // Use the new image rotation utility
  const rotation = useImageRotation({
    images,
    autoRotate: true,
    interval,
    fadeDuration: 2000, // 2s fade duration to match original
    preloadNext: true,
    pauseOnHover: false // Background carousel doesn't need hover pause
  });

  const { currentIndex: currentImageIndex } = rotation;
  
  // Get visible image indices for performance optimization
  const visibleIndices = getVisibleImageIndices(currentImageIndex, images.length, true);

  if (images.length === 0) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 ${className}`} {...rest} />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...rest}>
      {/* Render only visible images for performance */}
      {images.map((src: string, idx: number) => {
        // Only render visible images
        if (!visibleIndices.includes(idx)) return null;
        
        return (
          <img
            key={`bg-carousel-${String(idx)}`}
            src={src}
            alt={`${altText} ${String(idx + 1)}`}
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(idx, currentImageIndex, 2000)}`}
            style={getTransitionStyles(2000)}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        );
      })}
      
      {/* Optional overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-stone-900"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
};

export default BackgroundCarousel;
