// Hero background with rotating images for booking flow
import React from 'react';

import { useImageRotation } from '@/shared/hooks';
import { getImageOpacityClasses, getTransitionStyles, getVisibleImageIndices } from '@/shared/utils';

import { BOOKING_HERO_CONSTANTS } from '../../constants/hero';

interface HeroBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[];
  className?: string;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ 
  images = BOOKING_HERO_CONSTANTS.IMAGES,
  className = '',
  ...rest
}) => {
  // Use the new image rotation utility
  const rotation = useImageRotation({
    images,
    autoRotate: true,
    interval: BOOKING_HERO_CONSTANTS.IMAGE_ROTATION_INTERVAL,
    fadeDuration: 2000, // 2s fade duration to match original
    preloadNext: true,
    pauseOnHover: false // Background doesn't need hover pause
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
            key={`booking-hero-${String(idx)}`}
            src={src}
            alt={`Professional mobile detailing service ${String(idx + 1)}`}
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(idx, currentImageIndex, 2000)}`}
            style={{
              ...getTransitionStyles(2000),
              aspectRatio: BOOKING_HERO_CONSTANTS.IMAGE_DIMENSIONS.aspectRatio,
            }}
            width={BOOKING_HERO_CONSTANTS.IMAGE_DIMENSIONS.width}
            height={BOOKING_HERO_CONSTANTS.IMAGE_DIMENSIONS.height}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        );
      })}
    </div>
  );
};

export default HeroBackground;
