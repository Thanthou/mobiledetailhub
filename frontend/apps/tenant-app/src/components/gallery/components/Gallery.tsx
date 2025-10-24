import React, { useRef, useState } from 'react';

// Gallery section includes footer as part of its display
// This is intentional and part of the gallery feature's design
// eslint-disable-next-line no-restricted-imports -- Gallery displays footer as bottom half of section
import { Footer } from '@tenant-app/components/footer';

import { useGallery } from '../hooks/useGallery';
import { useRotatingGallery } from '../hooks/useRotatingGallery';
import { GalleryProps } from '../types';
import GalleryItem from './GalleryItem';
import RotatingGalleryItem from './RotatingGalleryItem';

const Gallery: React.FC<GalleryProps> = ({ onRequestQuote, locationData: _locationData }) => {
  // Mobile: manual swipe carousel
  const { images, loading, error } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Desktop: auto-rotating gallery
  const { currentImages, nextImages, loading: rotatingLoading, error: rotatingError, fadingIndex } = useRotatingGallery();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* MOBILE: Separate full-screen gallery section */}
      <section id="gallery" className="md:hidden relative h-screen snap-start snap-always flex items-center justify-center bg-theme-background px-4">
        <div className="h-full w-full flex items-center justify-center pt-[72px]">
        {loading ? (
          <div className="text-theme-text-muted">Loading gallery...</div>
        ) : error ? (
          <div className="text-red-400">Error loading gallery: {error}</div>
        ) : images.length === 0 ? (
          <div className="text-theme-text-muted">No images available</div>
        ) : (
          <div className="relative w-full mx-auto flex flex-col h-full justify-center">
            <h2 className="text-3xl font-bold text-theme-text text-center mb-8">Gallery</h2>
            
            {/* Swipeable gallery - full width on mobile */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full"
            >
              {/* Main large image */}
              <ul className="w-full mb-6">
                {images[currentIndex] && <GalleryItem image={images[currentIndex]} />}
              </ul>

              {/* Next 2 thumbnails preview */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 gap-4 px-4">
                  {images[(currentIndex + 1) % images.length] && (
                    <button
                      onClick={() => { setCurrentIndex((currentIndex + 1) % images.length); }}
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={images[(currentIndex + 1) % images.length].src}
                        alt={images[(currentIndex + 1) % images.length].alt}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  )}
                  {images[(currentIndex + 2) % images.length] && (
                    <button
                      onClick={() => { setCurrentIndex((currentIndex + 2) % images.length); }}
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={images[(currentIndex + 2) % images.length].src}
                        alt={images[(currentIndex + 2) % images.length].alt}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentIndex(index); }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === index
                        ? 'bg-orange-500'
                        : 'bg-gray-400 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </section>

      {/* MOBILE: Separate footer section */}
      <section id="footer" className="md:hidden relative snap-start snap-always bg-theme-background">
        <div className="pt-[72px] py-12">
        <Footer onRequestQuote={onRequestQuote || (() => { /* noop */ })} />
        </div>
      </section>

      {/* DESKTOP: Combined gallery + footer in one section (original) */}
      <section id="gallery-desktop" className="hidden md:block relative h-screen snap-start snap-always overflow-hidden bg-theme-background">
        <div className="h-full pt-[88px]">
        <div className="relative z-10 h-full px-4 pt-20">
          {/* Top Half - Gallery */}
          <div className="h-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
            {rotatingLoading ? (
              <div className="flex items-center justify-center">
                <div className="text-theme-text-muted">Loading gallery...</div>
              </div>
            ) : rotatingError ? (
              <div className="flex items-center justify-center">
                <div className="text-red-400">Error loading gallery: {rotatingError}</div>
              </div>
            ) : currentImages.length === 0 ? (
              <div className="flex items-center justify-center">
                <div className="text-theme-text-muted">No images available</div>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 w-full">
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
        </div>
      </section>
    </>
  );
};

export default Gallery;
