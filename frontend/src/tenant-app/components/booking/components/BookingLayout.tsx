import React from 'react';

import { useImageRotation } from '@/shared/hooks';
import { getImageOpacityClasses, getTransitionStyles } from '@/shared/utils';

import { useBookingGallery } from '../hooks/useBookingGallery';
import { Footer } from './shared';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: string;
  completedSteps: string[];
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  isLoading: boolean;
  nextLabel: string;
  backLabel: string;
  showNavigation: boolean;
  averageRating?: number;
  totalReviews?: number;
  showTrustStrip?: boolean;
  className?: string;
}

/**
 * BookingLayout - Provides consistent layout structure for booking steps
 * Fixes absolute positioning issues by using proper grid layout
 */
const BookingLayout: React.FC<BookingLayoutProps> = ({
  children,
  currentStep,
  completedSteps,
  onNext,
  onBack,
  onCancel,
  canGoNext,
  canGoBack,
  canSkip,
  isLoading,
  nextLabel,
  backLabel,
  showNavigation,
  averageRating = 4.9,
  totalReviews = 112,
  showTrustStrip = true,
  className = ''
}) => {
  // Load gallery images for background carousel
  const { images: galleryImages, isLoading: loading } = useBookingGallery();

  // Extract image URLs for the rotation utility
  const imageUrls = galleryImages.map(img => img.src).filter(Boolean);

  // Use the image rotation utility
  const rotation = useImageRotation({
    images: imageUrls,
    autoRotate: true,
    interval: 7000, // 7 seconds to match original
    fadeDuration: 2000, // 2 seconds fade duration
    preloadNext: true,
    pauseOnHover: false // Background doesn't need hover pause
  });

  const { currentIndex } = rotation;

  const getStepTitle = (step: string) => {
    const titles = {
      'vehicle-selection': 'Vehicle Details',
      'location': 'Service Location',
      'service-tier': 'Service Selection',
      'addons': 'Add-ons',
      'schedule': 'Schedule',
      'payment': 'Payment'
    };
    return titles[step as keyof typeof titles] || 'Booking Step';
  };


  return (
    <section className={`relative w-full min-h-screen bg-stone-900 overflow-hidden ${className}`}>
      {/* Hero Background with Image Rotation */}
      <div className="absolute inset-0 z-0">
        {/* Render all images with opacity transitions */}
        {galleryImages.map((image, index) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt || `Booking background image ${String(index + 1)}`}
            className={`absolute inset-0 w-full h-full object-cover ${getImageOpacityClasses(index, currentIndex, 2000)}`}
            style={getTransitionStyles(2000)}
            decoding={index === 0 ? 'sync' : 'async'}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        
        {/* Fallback background if no images loaded */}
        {!galleryImages.length && !loading && (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" />
        )}
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Step Header - Absolutely positioned to not affect layout */}
      <div className="absolute top-20 left-0 right-0 z-20">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            {getStepTitle(currentStep)}
          </h1>
        </div>
      </div>

      {/* Content Container with Proper Grid Layout */}
      <div className="relative z-20 h-screen grid grid-rows-[1fr_auto]">

        {/* Main Content Area */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-2xl">
            <div className="space-y-8">
              {children}
            </div>
          </div>
        </div>

        {/* Footer with Step Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 pb-8">
          <Footer
            currentStep={currentStep}
            completedSteps={completedSteps}
            showStepProgress={true}
            averageRating={averageRating}
            totalReviews={totalReviews}
            showTrustStrip={showTrustStrip}
            onNext={onNext}
            onBack={onBack}
            onCancel={onCancel}
            canGoNext={canGoNext}
            canGoBack={canGoBack}
            canSkip={canSkip}
            isLoading={isLoading}
            nextLabel={nextLabel}
            backLabel={backLabel}
            showNavigation={showNavigation}
          />
        </div>
      </div>
    </section>
  );
};

export default BookingLayout;
