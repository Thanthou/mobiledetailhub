import React from 'react';

import { ReviewsSummary } from '@shared/ui';
import { useReviewsRating } from '@tenant-app/components/reviews/hooks';

import CTA from './CTA';
import TextDisplay from './TextDisplay';

interface ContentContainerProps {
  title: string;
  subtitle: string;
  onRequestQuote?: () => void;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  title, 
  subtitle,
  onRequestQuote,
  className = "" 
}) => {
  // Get review data from tenant-app's reviews hook
  const reviewData = useReviewsRating();
  
  return (
    <div className={`flex flex-col items-center justify-end h-full ${className}`}>
      <TextDisplay 
        title={title} 
        subtitle={subtitle}
        className="mb-0 sm:mb-8" 
      />
      <CTA onRequestQuote={onRequestQuote} />
      <ReviewsSummary 
        averageRating={reviewData.averageRating}
        totalReviews={reviewData.totalReviews}
        googleBusinessUrl={reviewData.googleBusinessUrl}
        variant="compact" 
        className="mt-0 sm:mt-6 text-base sm:text-lg md:text-xl" 
      />
    </div>
  );
};

export default ContentContainer;
