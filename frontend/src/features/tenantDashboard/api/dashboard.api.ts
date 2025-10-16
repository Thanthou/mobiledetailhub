/**
 * Dashboard API Layer
 * Handles all dashboard-related API calls
 */

export interface DashboardData {
  id: string;
  slug: string;
  business_name: string;
  first_name: string;
  last_name: string;
  business_phone: string;
  personal_phone: string;
  business_email: string;
  personal_email: string;
  industry: string;
  application_status: string;
  business_start_date: string;
  service_areas: ServiceArea[];
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id?: string;
  city: string;
  state: string;
  zip?: number;
  primary: boolean;
  minimum: number;
  multiplier: number;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
  error?: string;
}

export const dashboardApi = {
  /**
   * Get dashboard data for a tenant
   */
  getDashboardData: async (slug: string): Promise<DashboardData> => {
    try {
      const response = await fetch(`/api/tenants/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tenant not found');
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as DashboardApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      
      return result.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      throw new Error(`Failed to load dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Update tenant information
   */
  updateTenantInfo: async (slug: string, data: Partial<DashboardData>): Promise<DashboardData> => {
    try {
      const response = await fetch(`/api/tenants/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update tenant info: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as DashboardApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update tenant info');
      }
      
      return result.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      throw new Error(`Failed to update tenant info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get tenant health status
   */
  getTenantHealth: async (slug: string): Promise<{ status: string; lastChecked: string; issues: string[] }> => {
    try {
      const response = await fetch(`/api/tenants/${slug}/health`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tenant health: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as { success: boolean; data: { status: string; lastChecked: string; issues: string[] } };
      
      if (!result.success) {
        throw new Error('Failed to fetch tenant health');
      }
      
      return result.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      throw new Error(`Failed to load tenant health: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
