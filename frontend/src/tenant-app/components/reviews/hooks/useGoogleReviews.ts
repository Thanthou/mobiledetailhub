/**
 * useGoogleReviews Hook
 * 
 * Fetches Google Business Profile reviews with mock fallback
 * Integrates with the backend Google Reviews API
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  comment: string;
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  createTime: string;
  updateTime: string;
}

export interface GoogleReviewsResponse {
  success: boolean;
  data: GoogleReview[];
  source: 'google' | 'mock';
  tenantSlug: string;
  message: string;
}

export interface UseGoogleReviewsOptions {
  tenantSlug?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Convert Google star rating to number
 */
function starRatingToNumber(rating: string): number {
  const ratingMap: Record<string, number> = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5
  };
  return ratingMap[rating] || 5;
}

/**
 * Transform Google review to frontend format
 */
function transformGoogleReview(review: GoogleReview) {
  return {
    id: review.reviewId,
    customerName: review.reviewer.displayName,
    profileImage: review.reviewer.profilePhotoUrl,
    rating: starRatingToNumber(review.starRating),
    reviewText: review.comment,
    date: review.createTime,
    isVerified: true, // Google reviews are verified
    isFeatured: false,
    source: 'google' as const
  };
}

/**
 * Hook to fetch Google Business Profile reviews
 */
export function useGoogleReviews(options: UseGoogleReviewsOptions = {}) {
  const { tenantSlug, enabled = true, refetchInterval } = options;

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['google-reviews', tenantSlug],
    queryFn: async (): Promise<GoogleReviewsResponse> => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }

      const response = await fetch(`/api/google-reviews/${tenantSlug}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: enabled && !!tenantSlug,
    refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Transform the data for frontend consumption
  const reviews = useMemo(() => {
    if (!response?.data) return [];
    return response.data.map(transformGoogleReview);
  }, [response?.data]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!reviews.length) return null;

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      source: response?.source || 'unknown'
    };
  }, [reviews, response?.source]);

  // Determine if review section should be shown
  const shouldShowReviews = reviews.length > 0;

  return {
    reviews,
    summary,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    isRefetching,
    source: response?.source,
    message: response?.message,
    shouldShowReviews
  };
}

/**
 * Hook to get Google Reviews health status
 */
export function useGoogleReviewsHealth(tenantSlug?: string) {
  const {
    data: health,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['google-reviews-health', tenantSlug],
    queryFn: async () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }

      const response = await fetch(`/api/google-reviews/${tenantSlug}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!tenantSlug,
    refetchInterval: 60 * 1000, // Check every minute
    staleTime: 30 * 1000 // 30 seconds
  });

  return {
    health,
    isLoading,
    isError,
    error: error as Error | null
  };
}
