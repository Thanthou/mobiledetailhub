// Reviews API client
import type { DatabaseReview, ReviewQueryParams, ReviewsResponse } from '../types';

const API_BASE_URL = '/api/reviews';

export const reviewsApi = {
  // Get reviews with filtering
  getReviews: async (params: ReviewQueryParams = {}): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    return response.json() as Promise<ReviewsResponse>;
  },

  // Get a specific review by ID
  getReview: async (id: string): Promise<{ success: boolean; data: DatabaseReview }> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch review: ${response.statusText}`);
    }

    return response.json();
  },

  // Submit a new review
  submitReview: async (reviewData: {
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
    review_source?: 'website' | 'google' | 'yelp' | 'facebook' | 'imported';
    service_category?: string;
    service_date?: string;
    booking_id?: number;
  }): Promise<{ success: boolean; data: DatabaseReview }> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit review: ${response.statusText}`);
    }

    return response.json();
  },

  // Vote on a review
  voteOnReview: async (reviewId: string, voteType: 'helpful' | 'not_helpful'): Promise<{
    success: boolean;
    data: { helpful_votes: number; total_votes: number };
  }> => {
    const response = await fetch(`${API_BASE_URL}/${reviewId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vote_type: voteType,
        user_ip: '127.0.0.1', // TODO: Get actual user IP
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to vote on review: ${response.statusText}`);
    }

    return response.json();
  },
};
