import React from 'react';

import { useAffiliate } from '../../../../../hooks/useAffiliate';
import { Reviews as BaseReviews } from '../Reviews';
import type { ReviewsProps } from '../types';

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
