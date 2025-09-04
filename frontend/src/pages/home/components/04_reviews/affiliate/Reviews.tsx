import React from 'react';
import { Reviews as BaseReviews } from '../Reviews';
import { ReviewsProps } from '../types';
import { useAffiliate } from '../../../../../contexts/AffiliateContext';

export const ReviewsAffiliate: React.FC<ReviewsProps> = (props) => {
  const { businessSlug } = useAffiliate();
  
  return (
    <BaseReviews 
      {...props} 
      reviewType="affiliate"
      businessSlug={businessSlug || props.businessSlug}
    />
  );
};

export default ReviewsAffiliate;
