// Main component export
export { Reviews } from './Reviews';

// Affiliate and MDH specific exports
export { default as ReviewsAffiliate } from './affiliate';
export { default as ReviewsMDH } from './mdh';

// Individual component exports
export { ReviewCard } from './ReviewCard';
export { StarRating } from './StarRating';
export { ReviewsHeader } from './ReviewsHeader';
export { GoogleBadge } from './GoogleBadge';

// Type exports
export type { Review, ReviewsProps, ReviewCardProps, StarRatingProps } from './types';

// Mock data export
export { mockReviews } from './mockData';