import React from 'react';
import { Star } from 'lucide-react';
import { StarRatingProps } from './types';

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showCount = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= rating;
    
    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled 
            ? 'fill-orange-400 text-orange-400' 
            : 'fill-stone-600 text-stone-600'
        } transition-colors duration-200`}
      />
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {stars}
      </div>
      {showCount && (
        <span className="text-sm text-gray-300 ml-2">
          ({rating}/{maxStars})
        </span>
      )}
    </div>
  );
};