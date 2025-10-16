/**
 * API functions for SEO configuration
 */

import type { SEOApiResponse, SEOConfig, SEOUpdateRequest } from '../types/seo.types';

export const fetchSEO = async (): Promise<SEOConfig> => {
  const res = await fetch("/api/seo/config");
  if (!res.ok) {
    throw new Error(`Failed to fetch SEO config: ${res.statusText}`);
  }
  const data = await res.json() as SEOApiResponse;
  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch SEO config');
  }
  return data.data;
};

export const updateSEO = async (data: SEOUpdateRequest): Promise<SEOConfig> => {
  const res = await fetch("/api/seo/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update SEO config: ${res.statusText}`);
  }
  
  const response = await res.json() as SEOApiResponse;
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to update SEO config');
  }
  return response.data;
};
