import React from 'react';
import { Reviews as BaseReviews } from '../Reviews';
import { ReviewsProps } from '../types';

export const ReviewsMDH: React.FC<ReviewsProps> = (props) => {
  return <BaseReviews {...props} />;
};

export default ReviewsMDH;
