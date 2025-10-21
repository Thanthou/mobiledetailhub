import React from 'react';

import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  onReviewClick?: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReviewClick }) => {
  const [imageError, setImageError] = React.useState(false);

  // Reset imageError when review changes
  React.useEffect(() => {
    setImageError(false);
  }, [review.id]);

  const handleClick = () => {
    onReviewClick?.(review);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onReviewClick?.(review);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 lg:p-9 cursor-pointer hover:bg-white/20 transition-colors h-[400px] flex flex-col"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Review by ${review.customerName}`}
    >
      <div className="flex items-center mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0 ${review.profileImage && !imageError ? 'bg-transparent' : 'bg-orange-500'}`}>
            {review.profileImage && !imageError ? (
              <img 
                src={review.profileImage} 
                alt={review.customerName}
                className="w-full h-full object-cover rounded-full"
                width={64}
                height={64}
                loading="eager"
                decoding="sync"
                onError={handleImageError}
              />
            ) : (
              <span className="text-2xl">{review.customerName?.charAt(0).toUpperCase() || '?'}</span>
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

      {/* Review Content - Fixed height with overflow handling */}
      <div className="flex-1 flex flex-col justify-start pb-16 min-h-0">
        {/* Review Title */}
        {review.title && (
          <h5 className="text-white font-medium mb-2 text-base line-clamp-2">
            {review.title}
          </h5>
        )}

        <p className="text-gray-300 text-base leading-relaxed line-clamp-6 overflow-hidden">
          {review.reviewText}
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
              src={`/icons/${review.reviewSource}.png`}
              alt={`${review.reviewSource} review`}
              className="w-5 h-5 rounded object-contain"
              width={20}
              height={20}
              loading="eager"
              decoding="sync"
              onError={(e) => {
                console.error(`Failed to load ${review.reviewSource} icon`);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
