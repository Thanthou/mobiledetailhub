/**
 * Type definitions for SEO feature
 */

export interface SEOConfig {
  id?: number;
  business_id: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  og_image?: string;
  twitter_image?: string;
  canonical_path?: string;
  robots_directive?: string;
  jsonld_overrides?: Record<string, unknown>;
  analytics_config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface SEOUpdateRequest {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  og_image?: string;
  twitter_image?: string;
  canonical_path?: string;
  robots_directive?: string;
  jsonld_overrides?: Record<string, unknown>;
  analytics_config?: Record<string, unknown>;
}

export interface SEOApiResponse {
  success: boolean;
  data?: SEOConfig;
  error?: string;
}
