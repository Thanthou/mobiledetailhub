import React from 'react';
import { StarRating } from './StarRating';
import { ReviewCardProps } from './types';

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-stone-800 rounded-xl p-6 hover:bg-stone-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-stone-600 hover:border-orange-400/30">
      {/* Header with profile and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Profile image placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
            {review.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">
              {review.customerName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size="sm" />
              {review.isVerified && (
                <span className="text-orange-400 text-xs font-medium">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Google badge */}
        <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-gray-300 text-xs font-medium">Google</span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-300 leading-relaxed mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
        "{review.reviewText}"
      </p>

      {/* Date */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-600">
        <span className="text-gray-400 text-sm">
          {new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-orange-400/60 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};