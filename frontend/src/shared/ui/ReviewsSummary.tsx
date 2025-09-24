import React from 'react';
import { Star, Users } from 'lucide-react';
import type { ReviewsSummaryProps } from '@/shared/types/reviews';

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({ 
  averageRating = 4.9, 
  totalReviews = 112,
  googleBusinessUrl = 'https://share.google/fx8oPIguzvJmTarrl',
  className = '',
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';
  
  const containerClasses = isCompact 
    ? 'flex items-center justify-center gap-4'
    : 'flex items-center justify-center gap-8';
    
  const textSize = isCompact ? 'text-lg' : 'text-2xl';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-6 h-6';
  const usersIconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const dividerHeight = isCompact ? 'h-6' : 'h-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Rating Section - Clickable */}
      <a 
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        <Star className={`${iconSize} text-orange-400 fill-current`} />
        <span className={`${textSize} font-bold text-white`}>
          {averageRating.toFixed(1)}
        </span>
        <span className="text-gray-300">average</span>
      </a>
      
      {/* Vertical Divider */}
      <div className={`w-px ${dividerHeight} bg-stone-600`}></div>
      
      {/* Reviews Count Section - Clickable */}
      <a 
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        <Users className={`${usersIconSize} text-orange-400`} />
        <span className={`${textSize} font-bold text-white`}>
          {totalReviews}
        </span>
        <span className="text-gray-300">reviews</span>
      </a>
    </div>
  );
};

export default ReviewsSummary;
