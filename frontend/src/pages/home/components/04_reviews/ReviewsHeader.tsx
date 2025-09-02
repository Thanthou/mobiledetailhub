import React from 'react';
import { Star, Users, TrendingUp } from 'lucide-react';
import { Review } from './types';

interface ReviewsHeaderProps {
  reviews: Review[];
}

export const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({ reviews }) => {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-orange-500 rounded-full">
          <Star className="w-6 h-6 text-white fill-current" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          What Our Customers Say
        </h2>
      </div>
      
      <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
        Don't just take our word for it. See what our satisfied customers have to say about our premium mobile detailing services.
      </p>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-8 bg-stone-800 rounded-2xl p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-orange-400 fill-current" />
          <span className="text-2xl font-bold text-white">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-300">average</span>
        </div>
        
        <div className="w-px h-8 bg-stone-600"></div>
        
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          <span className="text-2xl font-bold text-white">
            {reviews.length}+
          </span>
          <span className="text-gray-300">reviews</span>
        </div>
        
        <div className="w-px h-8 bg-stone-600"></div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <span className="text-2xl font-bold text-white">
            100%
          </span>
          <span className="text-gray-300">satisfied</span>
        </div>
      </div>
    </div>
  );
};