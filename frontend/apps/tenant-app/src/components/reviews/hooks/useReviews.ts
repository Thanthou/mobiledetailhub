// Hook for fetching reviews
import { useQuery } from '@tanstack/react-query';

import { reviewsApi } from '../api';
import type { DatabaseReview,Review, ReviewQueryParams } from '../types';
import { usePreviewData } from '@/tenant-app/contexts/PreviewDataProvider';

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
  // Check for preview mode and get preview data
  const { isPreviewMode, previewData } = usePreviewData();
  
  // Create a stable query key based on params
  const queryKey = ['reviews', params];
  
  // Only fetch if we have meaningful params AND not in preview mode
  const hasParams = Object.values(params).some(value => value !== undefined && value !== '');
  const shouldFetch = hasParams && !isPreviewMode;
  
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
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  // In preview mode, return preview data
  if (isPreviewMode && previewData?.reviews) {
    // Transform preview reviews to match Review type
    const previewReviews: Review[] = previewData.reviews.map((review, index) => ({
      id: `preview-${index}`,
      customerName: review.name,
      rating: review.rating,
      reviewText: review.text,
      date: review.date,
      reviewSource: 'google' as const,
      profileImage: review.avatar,
      isVerified: true,
    }));

    return {
      reviews: previewReviews,
      loading: false,
      error: null,
      pagination: null,
      refetch: () => {},
      loadMore: () => {}
    };
  }
  
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
