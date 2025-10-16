/**
 * Tenant API Layer
 * Handles all tenant-related API calls
 */

import { Business, Tenant } from '@/shared/types/tenant';

export interface TenantApiResponse {
  success: boolean;
  data: Business | Tenant | Business[] | Tenant[];
  error?: string;
}

export interface TenantsListResponse {
  success: boolean;
  data: Tenant[];
  error?: string;
}

export const tenantApi = {
  /**
   * Get all tenants
   */
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await fetch('/api/tenants');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tenants: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as TenantsListResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tenants');
      }
      
      return result.data;
    } catch (error) {
      console.error('Tenant API Error:', error);
      throw new Error(`Failed to load tenants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get tenant by slug
   */
  getTenantBySlug: async (slug: string): Promise<Business> => {
    try {
      const response = await fetch(`/api/tenants/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Business not found');
        }
        throw new Error(`Failed to fetch business: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as TenantApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch business');
      }
      
      return result.data as Business;
    } catch (error) {
      console.error('Tenant API Error:', error);
      throw new Error(`Failed to load business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get tenants by industry
   */
  getTenantsByIndustry: async (industry: string): Promise<Tenant[]> => {
    try {
      const response = await fetch(`/api/tenants?industry=${encodeURIComponent(industry)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tenants by industry: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as TenantsListResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tenants by industry');
      }
      
      return result.data;
    } catch (error) {
      console.error('Tenant API Error:', error);
      throw new Error(`Failed to load tenants for industry ${industry}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get available industries
   */
  getIndustries: async (): Promise<{ industry: string; count: number }[]> => {
    try {
      const response = await fetch('/api/tenants/industries/list');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch industries: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as { success: boolean; data: { industry: string; count: number }[] };
      
      if (!result.success) {
        throw new Error('Failed to fetch industries');
      }
      
      return result.data;
    } catch (error) {
      console.error('Tenant API Error:', error);
      throw new Error(`Failed to load industries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
