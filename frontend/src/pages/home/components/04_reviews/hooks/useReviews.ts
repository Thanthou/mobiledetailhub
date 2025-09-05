import { useState, useEffect, useCallback, useRef } from 'react';
import { DatabaseReview, Review, ReviewsResponse, ReviewQueryParams } from '../types';

// Utility function to convert database review to frontend review
const convertDatabaseReviewToReview = (dbReview: DatabaseReview): Review => ({
  id: dbReview.id.toString(),
  customerName: dbReview.reviewer_name,
  profileImage: dbReview.reviewer_avatar_url,
  rating: dbReview.rating,
  reviewText: dbReview.content,
  title: dbReview.title,
  date: dbReview.service_date || dbReview.published_at || dbReview.created_at,
  isVerified: dbReview.is_verified,
  isFeatured: dbReview.is_featured,
  helpfulVotes: dbReview.helpful_votes,
  totalVotes: dbReview.total_votes,
  serviceCategory: dbReview.service_category,
  businessName: dbReview.business_name,
  businessSlug: dbReview.business_slug,
  reviewSource: dbReview.review_source,
  reviewerUrl: dbReview.reviewer_url
});

// Custom hook for fetching reviews
export const useReviews = (params: ReviewQueryParams = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null>(null);
  const isFetchingRef = useRef(false);

  const fetchReviews = useCallback(async (queryParams: ReviewQueryParams = {}) => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Build query string
      const searchParams = new URLSearchParams();
      Object.entries({ ...params, ...queryParams }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/reviews?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data: ReviewsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      const convertedReviews = data.data.map(convertDatabaseReviewToReview);
      setReviews(convertedReviews);
      setPagination(data.pagination || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching reviews';
      setError(errorMessage);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [params]); // Only depend on params

  useEffect(() => {
    // Only fetch if we have meaningful params
    const hasParams = Object.values(params).some(value => value !== undefined && value !== null && value !== '');
    if (hasParams) {
      fetchReviews();
    }
  }, [params]); // Only depend on params

  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  const loadMore = useCallback(() => {
    if (pagination?.hasMore) {
      fetchReviews({ offset: pagination.offset + pagination.limit });
    }
  }, [pagination, fetchReviews]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch,
    loadMore
  };
};

// Custom hook for fetching a single review
export const useReview = (id: string) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/reviews/${reviewId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch review: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch review');
      }

      setReview(convertDatabaseReviewToReview(data.data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching review';
      setError(errorMessage);
      console.error('Error fetching review:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchReview(id);
    }
  }, [id, fetchReview]);

  return {
    review,
    loading,
    error,
    refetch: () => fetchReview(id)
  };
};

// Custom hook for submitting a review
export const useSubmitReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(async (reviewData: {
    review_type: 'affiliate' | 'mdh';
    affiliate_id?: number;
    business_slug?: string;
    rating: number;
    title?: string;
    content: string;
    reviewer_name: string;
    reviewer_email?: string;
    reviewer_phone?: string;
    reviewer_avatar_url?: string;
    service_category?: string;
    service_date?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting review';
      setError(errorMessage);
      console.error('Error submitting review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitReview,
    loading,
    error
  };
};

// Custom hook for voting on reviews
export const useReviewVote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voteOnReview = useCallback(async (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    try {
      setLoading(true);
      setError(null);

      // Get user's IP (simplified - in production you might want to get this from the server)
      const userIp = '127.0.0.1'; // This should be handled by the backend

      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: voteType,
          user_ip: userIp
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to vote on review');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while voting on review';
      setError(errorMessage);
      console.error('Error voting on review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    voteOnReview,
    loading,
    error
  };
};
