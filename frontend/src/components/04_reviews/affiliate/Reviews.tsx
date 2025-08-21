import React from 'react';
import { Reviews as BaseReviews } from '../Reviews';
import { ReviewsProps } from '../types';

export const ReviewsAffiliate: React.FC<ReviewsProps> = (props) => {
  return <BaseReviews {...props} />;
};

export default ReviewsAffiliate;
