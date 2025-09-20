import React from 'react';
import { Star, Users } from 'lucide-react';

interface ReviewsSubHeaderProps {
  averageRating?: number;
  totalReviews?: number;
  googleBusinessUrl?: string;
}

const ReviewsSubHeader: React.FC<ReviewsSubHeaderProps> = ({ 
  averageRating = 4.9, 
  totalReviews = 112,
  googleBusinessUrl = 'https://share.google/fx8oPIguzvJmTarrl'
}) => {
  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      {/* Rating Section - Clickable */}
      <a 
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        <Star className="w-6 h-6 text-orange-400 fill-current" />
        <span className="text-2xl font-bold text-white">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-gray-300">average</span>
      </a>
      
      {/* Vertical Divider */}
      <div className="w-px h-8 bg-stone-600"></div>
      
      {/* Reviews Count Section - Clickable */}
      <a 
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        <Users className="w-5 h-5 text-orange-400" />
        <span className="text-2xl font-bold text-white">
          {totalReviews}
        </span>
        <span className="text-gray-300">reviews</span>
      </a>
    </div>
  );
};

export default ReviewsSubHeader;
