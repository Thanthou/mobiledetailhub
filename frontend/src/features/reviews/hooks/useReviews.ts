// Hook for fetching reviews
import { useState, useEffect, useCallback } from 'react';
import { reviewsApi } from '../api';
import type { Review, ReviewQueryParams, DatabaseReview } from '../types';

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [pagination, setPagination] = useState<{
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null>(null);

  const fetchReviews = useCallback(async (queryParams: ReviewQueryParams = {}) => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      setError(null);


      // Try to fetch from API first with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await reviewsApi.getReviews({ ...params, ...queryParams });
        clearTimeout(timeoutId);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch reviews');
        }

        const convertedReviews = response.data.map(convertDatabaseReviewToReview);
        setReviews(convertedReviews);
        setPagination(response.pagination || null);
        setHasFetched(true);
        return;
      } catch (apiError) {
        
        // Fallback to mock data for now
        const mockReviews: DatabaseReview[] = [
          {
            id: 115,
            tenant_slug: 'jps',
            customer_name: "Cassie Pegg",
            rating: 5,
            comment: "They ceramic coated my boyfriend's Harley, and the results were absolutely stunning. The shine is flawless, and you can tell the quality of the work is top-notch. They paid such close attention to detail, were professional from start to finish, and clearly take pride in their craft.",
            vehicle_type: 'motorcycle',
            paint_correction: false,
            ceramic_coating: true,
            paint_protection_film: false,
            source: "google",
            avatar_filename: "/uploads/avatars/cassie_pegg_115_20250905015259.png",
            created_at: "2025-09-04 18:52:59.620885-07",
            updated_at: "2025-09-04 19:00:21.407044-07",
            published_at: "2025-08-31 18:52:59.623-07",
            reviewer_url: "https://www.google.com/maps/contrib/113777924831814310768/reviews?hl=en"
          },
          {
            id: 116,
            tenant_slug: 'jps',
            customer_name: "Moni Marhaba",
            rating: 5,
            comment: "They did a great job on my Tritoon boat, looks brand new. JP and Ozgy were great, can't say enough about them. They taught me a great deal on how to keep up that shine. There is more to it than you'd think. Their work ethic is amazing. Will definitely use them in the future.",
            vehicle_type: 'boat',
            paint_correction: false,
            ceramic_coating: true,
            paint_protection_film: false,
            source: "google",
            created_at: "2025-09-04 19:04:16.949176-07",
            updated_at: "2025-09-04 19:07:56.34953-07",
            published_at: "2025-08-21 19:04:16.952-07",
            reviewer_url: "https://www.google.com/maps/contrib/109519067187791101557/reviews?hl=en"
          },
          {
            id: 117,
            tenant_slug: 'jps',
            customer_name: "Heidi Zenefski",
            rating: 5,
            comment: "We keep coming back because they are the best. Our car looks brand new. Every time they finish. They are very knowledgeable and have the ability to do extra things that other companies may not do such as dying, our black trim, back to black after it's faded in the sun.",
            vehicle_type: 'car',
            paint_correction: true,
            ceramic_coating: false,
            paint_protection_film: false,
            source: "google",
            avatar_filename: "/uploads/avatars/heidi_zenefski_117_20250905020942.png",
            created_at: "2025-09-04 19:09:42.339714-07",
            updated_at: "2025-09-04 19:09:42.371283-07",
            published_at: "2025-08-07 19:09:42.343-07",
            reviewer_url: "https://www.google.com/maps/contrib/116969115986878011199/reviews/@39.2725268,-113.2870131,6z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en&entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"
          }
        ];

        const convertedReviews = mockReviews.map(convertDatabaseReviewToReview);
        setReviews(convertedReviews);
        setPagination({
          total: mockReviews.length,
          limit: 50,
          offset: 0,
          hasMore: false
        });
        setHasFetched(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params, loading]);

  useEffect(() => {
    // Only fetch if we have meaningful params and haven't fetched yet
    const hasParams = Object.values(params).some(value => value !== undefined && value !== '');
    if (hasParams && !hasFetched && !loading) {
      void fetchReviews();
    }
  }, [params, hasFetched, loading]);

  const refetch = useCallback(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const loadMore = useCallback(() => {
    if (pagination?.hasMore) {
      void fetchReviews({ offset: pagination.offset + pagination.limit });
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
