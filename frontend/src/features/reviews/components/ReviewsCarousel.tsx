import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { Review } from '../types';
import ReviewCard from './ReviewCard';

interface ReviewsCarouselProps {
  reviews: Review[];
  onReviewClick?: (review: Review) => void;
  maxVisible?: number;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ 
  reviews, 
  onReviewClick,
  maxVisible = 3
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Determine how many reviews to show based on screen size
  // Mobile: 1, Tablet: 2, Desktop: 3
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const visibleCount = isMobile ? 1 : isTablet ? 2 : maxVisible;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : reviews.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < reviews.length - 1 ? prev + 1 : 0));
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
        // Swiped left - show next
        handleNext();
      } else {
        // Swiped right - show previous
        handlePrevious();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getVisibleReviews = () => {
    // Mobile: show 1 review only
    if (isMobile) {
      return [reviews[currentIndex]].filter(Boolean);
    }
    
    // Desktop/Tablet: show multiple reviews
    const visible: Review[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      const review = reviews[index];
      if (review) {
        visible.push(review);
      }
    }
    return visible;
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300 text-lg">No reviews available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Navigation Arrows - Hidden on mobile, shown on desktop */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg items-center justify-center"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg items-center justify-center"
            aria-label="Next review"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Reviews Container - Swipeable on mobile */}
      <div 
        className="px-4 md:px-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile: 1 review, Tablet: 2 reviews, Desktop: 3 reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getVisibleReviews().map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReviewClick={onReviewClick}
            />
          ))}
        </div>
      </div>

      {/* Dots Indicator - Show on mobile for swipe feedback */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-4 md:mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); }}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                currentIndex === index
                  ? 'bg-orange-500'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsCarousel;
