import React from 'react';
import siteData from '@/data/mdh/site.json';
import { useImageRotation } from '@/shared/hooks';
import { getVisibleImageIndices, getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';
import { useSiteContext } from '@/shared/utils/siteContext';

interface ImageCarouselProps {
  autoRotate?: boolean;
  interval?: number;
  locationData?: any;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  autoRotate = true, 
  interval = 7000,
  locationData
}) => {
  const { isLocation } = useSiteContext();
  
  // Determine which images to use
  let images: string[];
  let imageData: any[] = [];
  
  if (isLocation && locationData?.images) {
    // Use location-specific hero images
    imageData = locationData.images.filter((img: any) => img.role === 'hero');
    images = imageData.map((img: any) => img.url);
  } else {
    // Fall back to main site hero images
    imageData = siteData.hero.images || [];
    images = imageData.map((img: any) => img.url);
  }
  
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
        
        const imgData = imageData[index];
        const isPriority = imgData?.priority || index === 0;
        
        return (
          <img
            key={index}
            src={image}
            alt={imgData?.alt || ""} // Use alt text from data when available
            width={imgData?.width}
            height={imgData?.height}
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
            style={getTransitionStyles(2000)}
            decoding={isPriority ? 'sync' : 'async'}
            loading={isPriority ? 'eager' : 'lazy'}
            fetchPriority={isPriority ? 'high' : 'low'}
          />
        );
      })}
      {/* Improved gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
    </div>
  );
};

export default ImageCarousel;
