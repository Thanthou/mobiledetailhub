// Main component export
export { Reviews } from './Reviews';

// Affiliate and MDH specific exports
export { default as ReviewsAffiliate } from './affiliate';
export { default as ReviewsMDH } from './mdh';

// Individual component exports
export { ReviewCard } from './ReviewCard';
export { StarRating } from './StarRating';
export { ReviewSourceIcon } from './ReviewSourceIcon';
export { ReviewModal } from './ReviewModal';
export { ReviewsHeader } from './ReviewsHeader';
export { GoogleBadge } from './GoogleBadge';
export { ReviewForm } from './ReviewForm';
export { ReviewSubmissionModal } from './ReviewSubmissionModal';
export { ReviewModeration } from './ReviewModeration';

// Hook exports
export * from './hooks/useReviews';

// Type exports
export type { 
  Review, 
  DatabaseReview,
  ReviewsProps, 
  ReviewCardProps, 
  StarRatingProps,
  ReviewFormProps,
  ReviewFormData,
  ReviewSubmission,
  ReviewUpdate,
  ReviewVote,
  ReviewQueryParams,
  ReviewsResponse,
  ReviewResponse
} from './types';

// Mock data export
export { mockReviews } from './mockData';