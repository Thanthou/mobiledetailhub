/**
 * API functions for SEO configuration
 */

import type { SEOApiResponse, SEOConfig, SEOUpdateRequest } from '../types/seo.types';
import { apiCall } from '@shared/api';

export const fetchSEO = async (): Promise<SEOConfig> => {
  const data = await apiCall<SEOApiResponse>('/api/seo/config');
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch SEO config');
  }
  return data.data;
};

export const updateSEO = async (updateData: SEOUpdateRequest): Promise<SEOConfig> => {
  const data = await apiCall<SEOApiResponse>('/api/seo/config', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to update SEO config');
  }
  return data.data;
};
