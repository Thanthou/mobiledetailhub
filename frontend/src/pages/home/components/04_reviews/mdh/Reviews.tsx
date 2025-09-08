import React from 'react';

import { Reviews as BaseReviews } from '../Reviews';
import type { ReviewsProps } from '../types';

export const ReviewsMDH: React.FC<ReviewsProps> = (props) => {
  return <BaseReviews {...props} />;
};

export default ReviewsMDH;
