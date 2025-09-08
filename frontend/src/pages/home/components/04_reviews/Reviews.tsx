import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useReviews } from './hooks/useReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';
import { ReviewsHeader } from './ReviewsHeader';
import type { Review, ReviewsProps } from './types';

export const Reviews: React.FC<ReviewsProps> = ({ 
  reviews: propReviews,
  maxReviews = 3,
  reviewType = 'mdh',
  businessSlug,
  featuredOnly = false,
  verifiedOnly = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Memoize the params object to prevent infinite loops
  const reviewParams = useMemo(() => ({
    type: reviewType,
    business_slug: businessSlug,
    featured_only: featuredOnly,
    verified_only: verifiedOnly,
    limit: 50 // Fetch more than needed for carousel
  }), [reviewType, businessSlug, featuredOnly, verifiedOnly]);
  
  // Fetch reviews from API if not provided as props
  const { 
    reviews: apiReviews, 
    loading, 
    error 
  } = useReviews(propReviews ? {} : reviewParams); // Don't fetch if we have prop reviews

  // Use prop reviews if provided, otherwise use API reviews
  const reviews = propReviews || apiReviews;
  
  // Sort reviews: featured first, then 5-star reviews, then by date (newest first)
  const sortedReviews = useMemo(() => {
    if (!reviews.length) return [];
    
    return [...reviews].sort((a, b) => {
      // First, sort by featured status
      if (a.isFeatured !== b.isFeatured) {
        return b.isFeatured ? 1 : -1;
      }
      // Then, sort by rating (5 stars first)
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      // Finally, sort by date (newest first)
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

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };
  
  // Show loading state
  if (loading) {
    return (
      <section className="bg-stone-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-stone-300">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="bg-stone-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-300 mb-2">Failed to load reviews</h3>
            <p className="text-stone-400 mb-4">{error}</p>
            <button 
              onClick={() => { window.location.reload(); }} 
              className="bg-orange-400 text-stone-900 px-6 py-2 rounded-lg hover:bg-orange-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!sortedReviews.length) {
    return (
      <section className="bg-stone-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-stone-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-300 mb-2">No reviews yet</h3>
            <p className="text-stone-400">Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-800 py-20 px-4 sm:px-6 lg:px-8">
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
                  animationDelay: `${(index * 100).toString()}ms`,
                }}
              >
                <ReviewCard 
                  review={review} 
                  onReviewClick={handleReviewClick}
                />
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
                  onClick={() => { setCurrentIndex(index * maxReviews); }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-400 scale-125'
                      : 'bg-stone-500 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to page ${(index + 1).toString()}`}
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Review Modal - Rendered at root level */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};