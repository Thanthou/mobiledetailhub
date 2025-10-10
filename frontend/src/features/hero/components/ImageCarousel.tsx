import React from 'react';

import { useData } from '@/shared/contexts';
import { useImageRotation } from '@/shared/hooks';
import type { LocationPage } from '@/shared/types/location';
import { getImageOpacityClasses, getTransitionStyles, getVisibleImageIndices } from '@/shared/utils';

interface HeroImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

interface ImageCarouselProps {
  autoRotate?: boolean;
  interval?: number;
  locationData?: LocationPage;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  autoRotate = true, 
  interval = 7000,
  locationData
}) => {
  const { isTenant, siteConfig } = useData();
  
  // Determine which images to use
  let images: string[];
  let imageData: HeroImage[] = [];
  
  if (isTenant && locationData?.images) {
    // Use location-specific hero images
    const heroImages = locationData.images.filter(img => img.role === 'hero');
    imageData = heroImages.map(img => ({
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      priority: img.priority
    }));
    images = imageData.map(img => img.url);
  } else {
    // Fall back to main site hero images from dynamically loaded site.json
    // Note: JSON uses "Images" (capital I) - type assertion needed until JSON is normalized
    const heroImages = (siteConfig?.hero as { Images?: HeroImage[] } | undefined)?.Images || [];
    imageData = heroImages;
    images = imageData.map(img => img.url);
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

  const { currentIndex } = rotation;
  
  // Get visible image indices for performance optimization
  const visibleIndices = getVisibleImageIndices(currentIndex, images.length, true);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Render only current and next images for performance */}
      {images.map((image, index) => {
        // Only render visible images
        if (!visibleIndices.includes(index)) return null;
        
        const imgData: HeroImage | undefined = imageData[index];
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
            // eslint-disable-next-line react/no-unknown-property -- fetchpriority is a valid HTML attribute (lowercase required)
            fetchpriority={isPriority ? 'high' : 'low'}
          />
        );
      })}
      {/* Improved gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
    </div>
  );
};

export default ImageCarousel;
