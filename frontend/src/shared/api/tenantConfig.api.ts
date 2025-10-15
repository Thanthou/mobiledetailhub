/**
 * Tenant Configuration API
 * Handles fetching and validation of tenant configs
 */

import { validateTenantConfig } from '../schemas';
import { TenantConfig, Vertical } from '../types';
import { apiClient } from './client';

/**
 * Affiliate API response structure
 */
interface AffiliateApiResponse {
  id?: string | number;
  slug?: string;
  business_name: string;
  business_phone?: string;
  phone?: string;
  business_email?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  service_areas?: Array<{ city: string; state: string; primary?: boolean }>;
  industry?: string;
  logo_url?: string;
}

/**
 * Fetch tenant configuration by slug
 * 
 * @param slug - Tenant slug (e.g., 'jps', 'johns-detailing')
 * @returns Validated TenantConfig
 */
export async function fetchTenantConfigBySlug(slug: string): Promise<TenantConfig> {
  const response = await apiClient.get<{ data?: AffiliateApiResponse }>(`/api/tenants/${slug}`);
  
  // API returns affiliate data, needs conversion
  const { data } = response;
  
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${slug}`);
  }
  
  // Import conversion helper dynamically to avoid circular deps
  const { affiliateToTenantConfig } = await import('../utils/tenantConfigMigration');
  
  // Convert affiliate API response to TenantConfig
  const config = affiliateToTenantConfig({
    id: data.id,
    slug: data.slug,
    business_name: data.business_name,
    business_phone: data.business_phone || data.phone,
    business_email: data.business_email || data.email,
    facebook_url: data.facebook_url,
    instagram_url: data.instagram_url,
    tiktok_url: data.tiktok_url,
    youtube_url: data.youtube_url,
    service_areas: data.service_areas,
    industry: data.industry,
    logo_url: data.logo_url
  });
  
  // Validate
  const result = validateTenantConfig(config);
  
  if (!result.success) {
    console.error('Tenant config validation failed:', result.errors);
    throw new Error('Invalid tenant configuration');
  }
  
  return result.data;
}

/**
 * Fetch tenant configuration by ID
 * 
 * @param tenantId - Tenant ID
 * @returns Validated TenantConfig
 */
export async function fetchTenantConfigById(tenantId: string | number): Promise<TenantConfig> {
  const response = await apiClient.get<{ data?: AffiliateApiResponse }>(`/api/tenants/id/${tenantId}`);
  
  const { data } = response;
  
  if (!data || !data.business_name) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }
  
  const { affiliateToTenantConfig } = await import('../utils/tenantConfigMigration');
  
  const config = affiliateToTenantConfig({
    id: data.id,
    slug: data.slug,
    business_name: data.business_name,
    business_phone: data.business_phone || data.phone,
    business_email: data.business_email || data.email,
    facebook_url: data.facebook_url,
    instagram_url: data.instagram_url,
    tiktok_url: data.tiktok_url,
    youtube_url: data.youtube_url,
    service_areas: data.service_areas,
    industry: data.industry,
    logo_url: data.logo_url
  });
  
  const result = validateTenantConfig(config);
  
  if (!result.success) {
    throw new Error('Invalid tenant configuration');
  }
  
  return result.data;
}

/**
 * List all tenants (optionally filtered by vertical)
 * 
 * @param vertical - Optional vertical filter
 * @returns Array of TenantConfig
 */
export async function fetchTenants(vertical?: Vertical): Promise<TenantConfig[]> {
  const queryParams = vertical ? `?industry=${vertical}` : '';
  const response = await apiClient.get<{ data: AffiliateApiResponse[] }>(`/api/tenants${queryParams}`);
  
  const { data } = response;
  
  if (!Array.isArray(data)) {
    return [];
  }
  
  const { affiliateToTenantConfig } = await import('../utils/tenantConfigMigration');
  
  // Convert and validate each tenant
  const configs = data.map(affiliate => {
    return affiliateToTenantConfig({
      id: affiliate.id,
      slug: affiliate.slug,
      business_name: affiliate.business_name,
      business_phone: affiliate.business_phone || affiliate.phone,
      business_email: affiliate.business_email || affiliate.email,
      facebook_url: affiliate.facebook_url,
      instagram_url: affiliate.instagram_url,
      tiktok_url: affiliate.tiktok_url,
      youtube_url: affiliate.youtube_url,
      service_areas: affiliate.service_areas,
      industry: affiliate.industry,
      logo_url: affiliate.logo_url
    });
  });
  
  return configs;
}

/**
 * Tenant config cache key factory
 * Provides consistent React Query cache keys
 */
export const tenantConfigKeys = {
  all: ['tenant', 'config'] as const,
  lists: () => [...tenantConfigKeys.all, 'list'] as const,
  list: (vertical?: Vertical) => [...tenantConfigKeys.lists(), { vertical }] as const,
  details: () => [...tenantConfigKeys.all, 'detail'] as const,
  detail: (identifier: string | number) => [...tenantConfigKeys.details(), identifier] as const,
  bySlug: (slug: string) => [...tenantConfigKeys.detail(slug), 'slug'] as const,
  byId: (id: string | number) => [...tenantConfigKeys.detail(id), 'id'] as const,
};

