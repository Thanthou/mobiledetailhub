import React, { useState } from 'react';
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : reviews.length - maxVisible));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < reviews.length - maxVisible ? prev + 1 : 0));
  };

  const getVisibleReviews = () => {
    return reviews.slice(currentIndex, currentIndex + maxVisible);
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
      {/* Navigation Arrows */}
      {reviews.length > maxVisible && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Reviews Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {getVisibleReviews().map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onReviewClick={onReviewClick}
          />
        ))}
      </div>

      {/* Dots Indicator */}
      {reviews.length > maxVisible && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(reviews.length / maxVisible) }).map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index * maxVisible); }}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentIndex / maxVisible) === index
                  ? 'bg-orange-500'
                  : 'bg-gray-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsCarousel;
