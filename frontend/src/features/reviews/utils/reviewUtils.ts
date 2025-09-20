// Review utility functions
import type { Review, DatabaseReview } from '../types';

// Convert database review to frontend review format
export const convertDatabaseReviewToReview = (dbReview: DatabaseReview): Review => ({
  id: dbReview.id.toString(),
  customerName: dbReview.reviewer_name,
  profileImage: dbReview.reviewer_avatar_url,
  rating: dbReview.rating,
  reviewText: dbReview.content,
  title: dbReview.title,
  date: dbReview.published_at || dbReview.created_at,
  isVerified: dbReview.is_verified,
  isFeatured: dbReview.is_featured,
  helpfulVotes: dbReview.helpful_votes,
  totalVotes: dbReview.total_votes,
  serviceCategory: dbReview.service_category,
  businessName: dbReview.business_name,
  businessSlug: dbReview.business_slug_actual,
  reviewSource: dbReview.review_source,
  reviewerUrl: dbReview.reviewer_url,
});

// Sort reviews by featured status, rating, and date
export const sortReviews = (reviews: Review[]): Review[] => {
  return [...reviews].sort((a, b) => {
    // First, sort by featured status
    if (a.isFeatured !== b.isFeatured) {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
    // Then, sort by rating (5 stars first)
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    // Finally, sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Format date for display
export const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
