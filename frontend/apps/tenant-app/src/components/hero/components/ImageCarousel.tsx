import React from 'react';

import { useImageRotation } from '@shared/hooks';
import { useData } from '@shared/hooks/useData';
import { getTransitionStyles } from '@shared/utils/imageRotation';
// Available when needed: toAvif, toWebp for modern image format support

interface HeroImage {
  url: string;
  mobileUrl?: string; // Optional mobile-specific image (portrait orientation)
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

interface ImageCarouselProps {
  autoRotate?: boolean;
  interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  autoRotate = true, 
  interval = 7000
}) => {
  const { siteConfig } = useData();
  
  // Get hero images from main site config
  const heroImages = (siteConfig?.hero as { Images?: HeroImage[] } | undefined)?.Images || [];
  const imageData: HeroImage[] = heroImages;
  const images: string[] = imageData.map(img => img.url);

  // Use the new image rotation utility (must be called unconditionally)
  const rotation = useImageRotation({
    images: images.length > 0 ? images : [''], // Provide dummy array if empty
    autoRotate,
    interval,
    fadeDuration: 2000, // 2s fade duration to match original
    preloadNext: true,
    pauseOnHover: false // Hero doesn't need hover pause
  });

  const { currentIndex } = rotation;
  
  // Guard: nothing to render (must be after ALL hooks)
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {images.map((image, index) => {
        const imgData: HeroImage | undefined = imageData[index];
        const desktopUrl = image;
        const mobileUrl = imgData?.mobileUrl;
        
        // Apply filter to hero2 and hero3 images for maid-service
        const needsFilter = image.includes('hero2') || image.includes('hero3');
        const imageFilter = needsFilter ? 'brightness(0.85) contrast(1.05) saturate(0.95)' : undefined;

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={getTransitionStyles(2000)}
          >
            {mobileUrl ? (
              <>
                {/* Mobile portrait (≤640px) */}
                <img
                  src={mobileUrl}
                  alt={imgData.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover object-top sm:hidden"
                  style={{
                    opacity: index === currentIndex ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: index === currentIndex ? 2 : 1,
                    ...(imageFilter && { filter: imageFilter })
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                {/* Tablet/Desktop (≥640px) */}
                <img
                  src={desktopUrl}
                  alt={imgData.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block"
                  style={{
                    opacity: index === currentIndex ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: index === currentIndex ? 2 : 1,
                    ...(imageFilter && { filter: imageFilter })
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </>
            ) : (
              <img
                src={desktopUrl}
                alt={imgData?.alt || ''}
                className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
                style={{
                  opacity: index === currentIndex ? 1 : 0,
                  transition: 'opacity 2s ease-in-out',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: index === currentIndex ? 2 : 1,
                  ...(imageFilter && { filter: imageFilter })
                }}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 pointer-events-none" />
    </div>
  );
};

export default ImageCarousel;
