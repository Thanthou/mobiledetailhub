/**
 * API utilities for tenant/business data with industry support
 * 
 * Single responsibility: HTTP calls to tenant endpoints
 */

import { env } from '../env';
import type { Vertical } from '../types/tenant.types';
import type { Business, BusinessResponse } from '../types/tenant-business.types';

const API_BASE_URL = env.VITE_API_URL || ''; // Empty string uses relative URLs (Vite proxy)

// Re-export types for convenience
export type { Business, BusinessResponse } from '../types/tenant-business.types';

export interface Tenant {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  first_name: string;
  last_name: string;
  user_id?: number;
  application_status: 'pending' | 'approved' | 'rejected';
  business_start_date: string;
  business_phone: string;
  personal_phone?: string;
  business_email: string;
  personal_email?: string;
  twilio_phone: string;
  sms_phone: string;
  website: string;
  gbp_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  source: string;
  notes?: string;
  service_areas: ServiceArea[];
  application_date: string;
  approved_date?: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
  google_maps_url?: string;
  industry: Vertical;
  logo_url?: string;
}

export interface ServiceArea {
  zip?: string;
  city: string;
  state: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

export interface TenantApiResponse {
  success: boolean;
  data?: Tenant;
  error?: string;
}

export interface TenantsListResponse {
  success: boolean;
  data?: Tenant[];
  error?: string;
}

/**
 * Fetch tenant data by slug with industry context
 * Legacy format - returns Tenant type
 */
export async function fetchTenantBySlug(slug: string): Promise<TenantApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenants/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.status}`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const data: Tenant = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch business data by slug
 * Used by DataContext - returns Business type with BusinessResponse wrapper
 */
export async function fetchBusinessBySlug(slug: string): Promise<Business> {
  const response = await fetch(`${API_BASE_URL}/api/tenants/${slug}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch business data');
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
  const result: BusinessResponse = await response.json();
  
  if (!result.success) {
    throw new Error('API returned error');
  }
  
  return result.data;
}

/**
 * Fetch all tenants by industry
 */
export async function fetchTenantsByIndustry(industry: Vertical): Promise<TenantsListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenants?industry=${industry}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tenants: ${response.status}`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const data: Tenant[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching tenants by industry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get industry-specific site configuration path
 */
export function getIndustrySiteConfigPath(industry: Vertical): string {
  return `/src/data/${industry}/site.json`;
}

/**
 * Get industry-specific public assets path
 */
export function getIndustryAssetsPath(industry: Vertical): string {
  return `/${industry}/images`;
}

/**
 * Get industry-specific data path
 */
export function getIndustryDataPath(industry: Vertical): string {
  return `/${industry}/data`;
}

