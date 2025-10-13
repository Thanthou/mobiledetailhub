import React from 'react';

import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  onReviewClick?: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReviewClick }) => {
  const handleClick = () => {
    onReviewClick?.(review);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onReviewClick?.(review);
    }
  };

  return (
    <div 
      className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 lg:p-9 cursor-pointer hover:bg-white/20 transition-colors"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Review by ${review.customerName}`}
    >
      <div className="flex items-center mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
            {review.profileImage ? (
              <img 
                src={review.profileImage} 
                alt={review.customerName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              review.customerName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{review.customerName}</h3>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Content - Word Count Based */}
      <div className="flex flex-col justify-start pb-16">
        {/* Review Title */}
        {review.title && (
          <h5 className="text-white font-medium mb-2 text-base">
            {review.title.split(' ').slice(0, 8).join(' ')}
            {review.title.split(' ').length > 8 && '...'}
          </h5>
        )}

        <p className="text-gray-300 text-base leading-relaxed">
          {review.reviewText.split(' ').slice(0, 25).join(' ')}
          {review.reviewText.split(' ').length > 25 && '...'}
        </p>
      </div>

      {/* Service Category and Review Source Icon - Fixed Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div>
          {review.serviceCategory && (
            <span className="text-sm bg-white/20 text-white px-3 py-2 rounded-full">
              {review.serviceCategory}
            </span>
          )}
        </div>
        <div>
          {review.reviewSource && (
            <img 
              src={`/shared/icons/${review.reviewSource}.png`}
              alt={review.reviewSource}
              className="w-5 h-5 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
