/**
 * API utilities for affiliate/tenant data with industry support
 */

import { env } from '../env';
import { Affiliate, IndustryType } from '../types/affiliate.types';

const API_BASE_URL = env.VITE_API_URL || 'http://localhost:3001';

export interface AffiliateApiResponse {
  success: boolean;
  data?: Affiliate;
  error?: string;
}

export interface AffiliatesListResponse {
  success: boolean;
  data?: Affiliate[];
  error?: string;
}

/**
 * Fetch affiliate data by slug with industry context
 */
export async function fetchAffiliateBySlug(slug: string): Promise<AffiliateApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenants/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch affiliate: ${response.status}`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const data: Affiliate = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching affiliate:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch all affiliates by industry
 */
export async function fetchAffiliatesByIndustry(industry: IndustryType): Promise<AffiliatesListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenants?industry=${industry}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch affiliates: ${response.status}`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
    const data: Affiliate[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching affiliates by industry:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get industry-specific site configuration path
 */
export function getIndustrySiteConfigPath(industry: IndustryType): string {
  return `/src/data/${industry}/site.json`;
}

/**
 * Get industry-specific public assets path
 */
export function getIndustryAssetsPath(industry: IndustryType): string {
  return `/${industry}/images`;
}

/**
 * Get industry-specific data path
 */
export function getIndustryDataPath(industry: IndustryType): string {
  return `/${industry}/data`;
}
