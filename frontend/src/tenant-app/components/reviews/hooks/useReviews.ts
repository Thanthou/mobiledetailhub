// Hook for fetching reviews
import { useQuery } from '@tanstack/react-query';

import { reviewsApi } from '../api';
import type { DatabaseReview,Review, ReviewQueryParams } from '../types';

// Convert database review to frontend review format
const convertDatabaseReviewToReview = (dbReview: DatabaseReview): Review => {
  const review: Review = {
    id: dbReview.id.toString(),
    customerName: dbReview.customer_name,
    rating: dbReview.rating,
    reviewText: dbReview.comment,
    date: dbReview.published_at || dbReview.created_at,
    reviewSource: dbReview.source,
  };

  // Add optional fields only if they exist
  if (dbReview.avatar_filename) {
    review.profileImage = `/uploads/avatars/${dbReview.avatar_filename}`;
  }
  if (dbReview.reviewer_url) {
    review.reviewerUrl = dbReview.reviewer_url;
  }
  if (dbReview.vehicle_type) {
    review.serviceCategory = dbReview.vehicle_type;
  }

  return review;
};

export const useReviews = (params: ReviewQueryParams = {}) => {
  // Create a stable query key based on params
  const queryKey = ['reviews', params];
  
  // Only fetch if we have meaningful params
  const hasParams = Object.values(params).some(value => value !== undefined && value !== '');
  
  const {
    data: response,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => { controller.abort(); }, 5000); // 5 second timeout
      
      try {
        const response = await reviewsApi.getReviews(params);
        clearTimeout(timeoutId);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch reviews');
        }
        
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    enabled: hasParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  // Convert database reviews to frontend format
  const reviews = response?.data ? response.data.map(convertDatabaseReviewToReview) : [];
  const pagination = response?.pagination || null;
  const errorMessage = error instanceof Error ? error.message : null;

  const loadMore = () => {
    if (pagination?.hasMore) {
      // For now, just refetch with current params
      // TODO: Implement proper pagination with offset
      refetch();
    }
  };

  return {
    reviews,
    loading,
    error: errorMessage,
    pagination,
    refetch,
    loadMore
  };
};
