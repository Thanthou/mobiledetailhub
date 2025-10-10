import { config } from '@/../config/env';

import type { QueryResult } from '../types';

const API_BASE = config.isProduction ? config.apiUrls.live : config.apiUrls.local;

/**
 * Execute a database query via the admin API
 */
export const executeQuery = async (query: string): Promise<QueryResult> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const endpoint = `${API_BASE}/admin/query`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const errorData = await response.json() as { error?: string };
    throw new Error(errorData.error ?? 'Failed to execute query');
  }

  const data = await response.json() as {
    success: boolean;
    fields?: unknown[];
    rows?: unknown[];
    rowCount?: number;
  };

  if (!data.success) {
    throw new Error('Query execution failed');
  }

  return {
    columns: Array.isArray(data.fields) ? data.fields.map(String) : [],
    rows: Array.isArray(data.rows) ? data.rows : [],
    rowCount: data.rowCount ?? 0,
    executionTime: Date.now()
  };
};

interface ReviewFormData {
  name: string;
  stars: number;
  title: string;
  content: string;
  type: 'affiliate' | 'mdh';
  businessSlug?: string;
  source: 'website' | 'google' | 'yelp' | 'facebook';
  daysAgo: number;
  weeksAgo: number;
  specificDate: string;
  serviceCategory: 'car' | 'truck' | 'boat' | 'rv' | 'motorcycle' | 'ceramic' | 'none';
  avatarFile?: File;
  reviewerUrl?: string;
}

interface SeedReviewsResponse {
  errorDetails?: unknown[];
  count?: number;
  reviewIds?: string[];
}

/**
 * Seed reviews via the admin API
 */
export const seedReviews = async (
  reviews: ReviewFormData[],
  signal?: AbortSignal
): Promise<SeedReviewsResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/admin/seed-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ reviews }),
    signal
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${String(response.status)} - ${errorText}`);
  }

  return await response.json() as SeedReviewsResponse;
};

/**
 * Upload a reviewer avatar via the admin API
 */
export const uploadReviewerAvatar = async (
  avatarFile: File,
  reviewerName: string,
  reviewId: string
): Promise<unknown> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('avatar', avatarFile);
  formData.append('reviewerName', reviewerName);
  formData.append('reviewId', reviewId);

  const response = await fetch('/api/avatar/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Avatar upload failed');
  }

  return await response.json();
};

