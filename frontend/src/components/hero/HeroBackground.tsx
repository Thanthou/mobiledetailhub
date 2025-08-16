import React from 'react';
import { useImageRotation } from '../../hooks/useImageRotation';
import { HERO_CONSTANTS } from './constants';

interface HeroBackgroundProps {
  images?: string[];
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ 
  images = HERO_CONSTANTS.IMAGES 
}) => {
  const currentImageIndex = useImageRotation({ 
    images, 
    interval: HERO_CONSTANTS.IMAGE_ROTATION_INTERVAL 
  });

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, idx) => (
        <img
          key={`hero-${idx}`}
          src={src}
          alt={`Hero background ${idx + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{
            opacity: idx === currentImageIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

export default HeroBackground;