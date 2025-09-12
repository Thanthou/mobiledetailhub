import React from 'react';

import { useImageRotation } from '@/shared/hooks';

import { HERO_CONSTANTS } from '../constants';
import type { HeroBackgroundProps } from '../types/index';

const HeroBackground: React.FC<HeroBackgroundProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
  images = HERO_CONSTANTS.IMAGES,
  className = '',
  ...rest
}) => {
  const currentImageIndex = useImageRotation({ 
    images, 
    interval: HERO_CONSTANTS.IMAGE_ROTATION_INTERVAL 
  });

  if (images.length === 0) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 ${className}`} {...rest} />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...rest}>
      {images.map((src: string, idx: number) => (
        <img
          key={`hero-${String(idx)}`}
          src={src}
          alt={`Professional mobile detailing service ${String(idx + 1)}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{
            opacity: idx === currentImageIndex ? 1 : 0,
            aspectRatio: HERO_CONSTANTS.IMAGE_DIMENSIONS.aspectRatio,
          }}
          width={HERO_CONSTANTS.IMAGE_DIMENSIONS.width}
          height={HERO_CONSTANTS.IMAGE_DIMENSIONS.height}
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
    </div>
  );
};

export default HeroBackground;