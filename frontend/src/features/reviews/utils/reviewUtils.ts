// Review utility functions
import type { Review, DatabaseReview } from '../types';

// Convert database review to frontend review format
export const convertDatabaseReviewToReview = (dbReview: DatabaseReview): Review => ({
  id: dbReview.id.toString(),
  customerName: dbReview.customer_name,
  profileImage: dbReview.avatar_filename ? `/uploads/avatars/${dbReview.avatar_filename}` : undefined,
  rating: dbReview.rating,
  reviewText: dbReview.comment,
  date: dbReview.published_at || dbReview.created_at,
  reviewSource: dbReview.source,
  reviewerUrl: dbReview.reviewer_url,
  serviceCategory: dbReview.vehicle_type,
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
