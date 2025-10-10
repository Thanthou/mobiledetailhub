import React from 'react';

// Gallery section includes footer as part of its display
// This is intentional and part of the gallery feature's design
// eslint-disable-next-line no-restricted-imports -- Gallery displays footer as bottom half of section
import { Footer } from '@/features/footer';

import { useRotatingGallery } from '../hooks/useRotatingGallery';
import { GalleryProps } from '../types';
import RotatingGalleryItem from './RotatingGalleryItem';

const Gallery: React.FC<GalleryProps> = ({ onRequestQuote, locationData: _locationData }) => {
  const { currentImages, nextImages, loading, error, fadingIndex } = useRotatingGallery();

  return (
    <section id="footer" className="relative h-screen snap-start snap-always overflow-hidden bg-stone-900">
      <div className="relative z-10 h-full px-4 pt-20">
        {/* Top Half - Gallery */}
        <div id="gallery" className="h-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="text-stone-400">Loading gallery...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <div className="text-red-400">Error loading gallery: {error}</div>
            </div>
          ) : currentImages.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="text-stone-400">No images available</div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {currentImages.map((image, index) => (
                <RotatingGalleryItem 
                  key={image.id} 
                  image={image} 
                  {...(nextImages[index] && { nextImage: nextImages[index] })}
                  isTransitioning={fadingIndex === index}
                  index={index}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Half - Footer Content */}
        <div className="h-1/2 flex flex-col justify-center border-t border-stone-700">
          <Footer onRequestQuote={onRequestQuote || (() => { /* noop */ })} />
        </div>
      </div>
    </section>
  );
};

export default Gallery;
