import React from 'react';
import siteData from '@/data/mdh/site.json';
import { useImageRotation, getVisibleImageIndices, getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';

interface ImageCarouselProps {
  autoRotate?: boolean;
  interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  autoRotate = true, 
  interval = 7000 
}) => {
  // Load images from site.json
  const images = siteData.hero.images.map(img => img.url);
  
  // Use the new image rotation utility
  const rotation = useImageRotation({
    images,
    autoRotate,
    interval,
    fadeDuration: 2000, // 2s fade duration to match original
    preloadNext: true,
    pauseOnHover: false // Hero doesn't need hover pause
  });

  const { currentIndex, nextIndex, hasMultipleImages } = rotation;
  
  // Get visible image indices for performance optimization
  const visibleIndices = getVisibleImageIndices(currentIndex, images.length, true);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Render only current and next images for performance */}
      {images.map((image, index) => {
        // Only render visible images
        if (!visibleIndices.includes(index)) return null;
        
        return (
          <img
            key={index}
            src={image}
            alt="" // decorative images
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
            style={getTransitionStyles(2000)}
            decoding={index === 0 ? 'sync' : 'async'}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        );
      })}
      {/* Improved gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
    </div>
  );
};

export default ImageCarousel;
