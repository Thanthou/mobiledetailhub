/**
 * Services API Layer
 * Handles all service-related API calls
 * Moved to shared layer to allow cross-feature usage
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  vehicle_type: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  vehicle_type: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  vehicle_type: string;
  tenant_id: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  vehicle_type?: string;
}

export interface ServicesApiResponse {
  success: boolean;
  data: Service | Service[];
  error?: string;
}

export const servicesApi = {
  /**
   * Get services for a tenant and vehicle type
   */
  getServices: async (tenantId: string, vehicleId: string, categoryId: string): Promise<Service[]> => {
    try {
      const response = await fetch(`/api/services/tenant/${tenantId}/vehicle/${vehicleId}/category/${categoryId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as ServicesApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch services');
      }
      
      return Array.isArray(result.data) ? result.data : [result.data];
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to load services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Create a new service
   */
  createService: async (serviceData: CreateServiceRequest): Promise<Service> => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create service: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as ServicesApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create service');
      }
      
      return result.data as Service;
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get a specific service by ID
   */
  getService: async (serviceId: string): Promise<Service> => {
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as ServicesApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch service');
      }
      
      return result.data as Service;
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to load service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Update a service
   */
  updateService: async (serviceId: string, serviceData: UpdateServiceRequest): Promise<Service> => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update service: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as ServicesApiResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update service');
      }
      
      return result.data as Service;
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to update service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Delete a service
   */
  deleteService: async (serviceId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as { success: boolean; error?: string };
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get service categories
   */
  getServiceCategories: async (vehicleType: string): Promise<ServiceCategory[]> => {
    try {
      const response = await fetch(`/api/services/categories?vehicle_type=${encodeURIComponent(vehicleType)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service categories: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json() as { success: boolean; data: ServiceCategory[] };
      
      if (!result.success) {
        throw new Error('Failed to fetch service categories');
      }
      
      return result.data;
    } catch (error) {
      console.error('Services API Error:', error);
      throw new Error(`Failed to load service categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
