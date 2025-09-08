// Main component export
export { Reviews } from './Reviews';

// Affiliate and MDH specific exports
export { default as ReviewsAffiliate } from './affiliate';
export { default as ReviewsMDH } from './mdh';

// Individual component exports
export { GoogleBadge } from './GoogleBadge';
export { ReviewCard } from './ReviewCard';
export { ReviewForm } from './ReviewForm';
export { ReviewModal } from './ReviewModal';
export { ReviewModeration } from './ReviewModeration';
export { ReviewsHeader } from './ReviewsHeader';
export { ReviewSourceIcon } from './ReviewSourceIcon';
export { ReviewSubmissionModal } from './ReviewSubmissionModal';
export { StarRating } from './StarRating';

// Hook exports
export * from './hooks/useReviews';

// Type exports
export type { 
  DatabaseReview,
  Review, 
  ReviewCardProps, 
  ReviewFormData,
  ReviewFormProps,
  ReviewQueryParams,
  ReviewResponse,
  ReviewsProps, 
  ReviewsResponse,
  ReviewSubmission,
  ReviewUpdate,
  ReviewVote,
  StarRatingProps} from './types';

// Mock data export
export { mockReviews } from './mockData';