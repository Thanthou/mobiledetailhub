import React from 'react';
import { Star, Users } from 'lucide-react';

import { useDataOptional } from '@shared/hooks/useData';
import type { ReviewsSummaryProps } from '@shared/types/reviews';

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({ 
  averageRating, 
  totalReviews,
  googleBusinessUrl,
  className = '',
  variant = 'default'
}) => {
  // Check if in preview mode
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  const isCompact = variant === 'compact';
  
  // Don't render if no data provided
  if (!averageRating || !totalReviews) {
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
          <Star className={`${iconSize} text-primary-light fill-current`} />
          <span className={`${textSize} font-bold text-theme-text`}>
            {averageRating.toFixed(1)}
          </span>
          <span className="text-theme-text-muted">average</span>
        </span>
      ) : (
        <a 
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <Star className={`${iconSize} text-primary-light fill-current`} />
          <span className={`${textSize} font-bold text-theme-text`}>
            {averageRating.toFixed(1)}
          </span>
          <span className="text-theme-text-muted">average</span>
        </a>
      )}
      
      {/* Vertical Divider */}
      <div className={`w-px ${dividerHeight} bg-theme-border-light`}></div>
      
      {/* Reviews Count Section - Clickable (or span in preview mode) */}
      {isPreview ? (
        <span className="flex items-center gap-2 cursor-pointer">
          <Users className={`${usersIconSize} text-primary-light`} />
          <span className={`${textSize} font-bold text-theme-text`}>
            {totalReviews.toLocaleString()}
          </span>
          <span className="text-theme-text-muted">reviews</span>
        </span>
      ) : (
        <a 
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <Users className={`${usersIconSize} text-primary-light`} />
          <span className={`${textSize} font-bold text-theme-text`}>
            {totalReviews.toLocaleString()}
          </span>
          <span className="text-theme-text-muted">reviews</span>
        </a>
      )}
    </div>
  );
};

export default ReviewsSummary;
