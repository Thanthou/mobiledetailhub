import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { ReviewsHeader } from './ReviewsHeader';
import { GoogleBadge } from './GoogleBadge';
import { ReviewsProps } from './types';
import { mockReviews } from './mockData';

export const Reviews: React.FC<ReviewsProps> = ({ 
  reviews = mockReviews, 
  maxReviews = 3,
  showGoogleBadge = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sort reviews: 5-star reviews first, then by date (newest first)
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      // First, sort by rating (5 stars first)
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      // Then sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [reviews]);
  
  const displayedReviews = sortedReviews.slice(currentIndex, currentIndex + maxReviews);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex + maxReviews < sortedReviews.length;
  
  const handlePrevious = () => {
    if (canGoLeft) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };
  
  const handleNext = () => {
    if (canGoRight) {
      setCurrentIndex(Math.min(sortedReviews.length - maxReviews, currentIndex + 1));
    }
  };
  
  return (
    <section className="bg-stone-700 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <ReviewsHeader reviews={sortedReviews} />

        {/* Reviews Carousel */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={!canGoLeft}
            className={`absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
              canGoLeft
                ? 'text-orange-400 hover:text-orange-300 hover:scale-125'
                : 'text-stone-500 cursor-not-allowed'
            }`}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canGoRight}
            className={`absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
              canGoRight
                ? 'text-orange-400 hover:text-orange-300 hover:scale-125'
                : 'text-stone-500 cursor-not-allowed'
            }`}
            aria-label="Next reviews"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
            {displayedReviews.map((review, index) => (
              <div
                key={review.id}
                className="transform transition-all duration-500 ease-in-out"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(sortedReviews.length / maxReviews) }, (_, index) => {
              const isActive = Math.floor(currentIndex / maxReviews) === index;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * maxReviews)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-400 scale-125'
                      : 'bg-stone-500 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Google Business Badge */}
        {showGoogleBadge && <GoogleBadge />}
      </div>
    </section>
  );
};