import React from 'react';
import { Star, Users } from 'lucide-react';

import { useReviewsRating } from '@/tenant-app/components/reviews/hooks';
import { useReviewsAvailability } from '@shared/hooks';
import { useDataOptional } from '@shared/hooks/useData';
import type { ReviewsSummaryProps } from '@shared/types/reviews';

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({ 
  averageRating: propAverageRating, 
  totalReviews: propTotalReviews,
  googleBusinessUrl: propGoogleBusinessUrl,
  className = '',
  variant = 'default'
}) => {
  // Check if in preview mode
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  
  // Check if reviews are available (unless in preview mode)
  const hasReviews = useReviewsAvailability();
  
  // Get data from database (with fallbacks to site.json)
  const dbData = useReviewsRating();
  
  // Use props if provided, otherwise use database/site data
  // Ensure averageRating is a number (convert if string)
  const averageRating = typeof propAverageRating === 'number' 
    ? propAverageRating 
    : (typeof dbData.averageRating === 'number' 
      ? dbData.averageRating 
      : parseFloat(String(dbData.averageRating)) || 4.9);
      
  // Ensure totalReviews is a number (convert if string)
  const totalReviews = typeof propTotalReviews === 'number'
    ? propTotalReviews
    : (typeof dbData.totalReviews === 'number'
      ? dbData.totalReviews
      : parseInt(String(dbData.totalReviews), 10) || 112);
      
  const googleBusinessUrl = propGoogleBusinessUrl ?? dbData.googleBusinessUrl;
  const isCompact = variant === 'compact';
  
  // Don't render if there are no reviews (unless in preview mode)
  if (!isPreview && !hasReviews) {
    return null;
  }
  
  const containerClasses = isCompact 
    ? 'flex items-center justify-center gap-4'
    : 'flex items-center justify-center gap-8';
    
  const textSize = isCompact ? 'text-lg' : 'text-2xl';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-6 h-6';
  const usersIconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const dividerHeight = isCompact ? 'h-6' : 'h-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Rating Section - Clickable (or span in preview mode) */}
      {isPreview ? (
        <span className="flex items-center gap-2 cursor-pointer">
          <Star className={`${iconSize} text-orange-400 fill-current`} />
          <span className={`${textSize} font-bold text-white`}>
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-300">average</span>
        </span>
      ) : (
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
      )}
      
      {/* Vertical Divider */}
      <div className={`w-px ${dividerHeight} bg-stone-600`}></div>
      
      {/* Reviews Count Section - Clickable (or span in preview mode) */}
      {isPreview ? (
        <span className="flex items-center gap-2 cursor-pointer">
          <Users className={`${usersIconSize} text-orange-400`} />
          <span className={`${textSize} font-bold text-white`}>
            {totalReviews.toLocaleString()}
          </span>
          <span className="text-gray-300">reviews</span>
        </span>
      ) : (
        <a 
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <Users className={`${usersIconSize} text-orange-400`} />
          <span className={`${textSize} font-bold text-white`}>
            {totalReviews.toLocaleString()}
          </span>
          <span className="text-gray-300">reviews</span>
        </a>
      )}
    </div>
  );
};

export default ReviewsSummary;
