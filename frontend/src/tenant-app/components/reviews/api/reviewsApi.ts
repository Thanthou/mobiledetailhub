// Reviews API client
import type { DatabaseReview, ReviewQueryParams, ReviewsResponse } from '../types';

const API_BASE_URL = '/api/reviews';

export const reviewsApi = {
  // Get reviews with filtering
  getReviews: async (params: ReviewQueryParams = {}): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
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

    return response.json() as Promise<{ success: boolean; data: DatabaseReview }>;
  },

  // Submit a new review
  submitReview: async (reviewData: {
    tenant_slug: string;
    customer_name: string;
    rating: number;
    comment: string;
    reviewer_url?: string;
    vehicle_type?: 'car' | 'truck' | 'suv' | 'boat' | 'rv' | 'motorcycle';
    paint_correction?: boolean;
    ceramic_coating?: boolean;
    paint_protection_film?: boolean;
    source?: 'website' | 'google' | 'yelp' | 'facebook';
    avatar_filename?: string;
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

    return response.json() as Promise<{ success: boolean; data: DatabaseReview }>;
  },

};
