import React from 'react';

import { GalleryImage } from '../types';

// Gallery item component with crossfade support
interface RotatingGalleryItemProps {
  image: GalleryImage;
  nextImage?: GalleryImage;
  isTransitioning: boolean;
  index: number;
}

const RotatingGalleryItem: React.FC<RotatingGalleryItemProps> = ({ image, nextImage, isTransitioning, index: _index }) => {
  // Fallback to current image if no next image
  const next = nextImage ?? image;
  
  return (
    <li>
      <div className={`group relative block rounded-lg overflow-hidden shadow-lg transition-all duration-1000 hover:-translate-y-2 hover:shadow-xl ${isTransitioning ? 'is-fading' : ''}`}>
        <div className="aspect-[3/2] relative">
          {/* Base layer: current image */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={image.loading || 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity will-change-opacity ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ transitionDuration: '1000ms' }}
            onError={(e) => {
              // Show a simple placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="absolute inset-0 w-full h-full bg-stone-700 flex items-center justify-center">
                    <div class="text-center text-stone-400">
                      <div class="text-4xl mb-2">📷</div>
                      <div class="text-sm">Add ${image.src.split('/').pop()}</div>
                    </div>
                  </div>
                `;
              }
            }}
          />
          {/* Overlay layer: next image */}
          <img
            src={next.src}
            alt={next.alt}
            width={next.width}
            height={next.height}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity will-change-opacity ${
              isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDuration: '1000ms' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity will-change-opacity"
        style={{ transitionDuration: '1000ms' }}>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 truncate">
              {isTransitioning ? (next.title || 'Untitled') : (image.title || 'Untitled')}
            </h3>
            <p className="text-stone-300 text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {isTransitioning ? (next.caption || 'No description available') : (image.caption || 'No description available')}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default RotatingGalleryItem;
