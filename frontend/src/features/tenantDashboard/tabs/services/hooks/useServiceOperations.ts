/**
 * Hook for managing service CRUD operations
 * Handles creating, updating, deleting services and refreshing the list
 */

import { useCallback } from 'react';

import type { Service } from '../types';
import type { useServicesAPI } from './useServicesData';

interface ServiceData {
  id: number;
  name: string;
  tiers?: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
    features?: string[];
    enabled: boolean;
    popular?: boolean;
  }>;
}

interface TierData {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

/**
 * Transform API service data to frontend Service format
 */
export function transformServiceData(servicesData: unknown[]): Service[] {
  return servicesData.map((serviceData: unknown) => {
    const service = serviceData as ServiceData;
    return {
      id: service.id.toString(),
      name: service.name,
      tiers: service.tiers && service.tiers.length > 0 ? service.tiers.map((tier) => ({
        id: tier.id.toString(),
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        features: tier.features || [],
        enabled: tier.enabled,
        popular: tier.popular || false
      })) : []
    };
  });
}

export function useServiceOperations(
  api: ReturnType<typeof useServicesAPI>,
  tenantId: string | undefined,
  selectedVehicle: string,
  selectedCategory: string
) {
  const { fetchServices, createService, updateService, deleteService } = api;

  /**
   * Refresh the services list for the current vehicle/category
   */
  const refreshServices = useCallback(async (): Promise<Service[]> => {
    const servicesData = await fetchServices(selectedVehicle, selectedCategory);
    if (servicesData && Array.isArray(servicesData)) {
      return transformServiceData(servicesData);
    }
    return [];
  }, [fetchServices, selectedVehicle, selectedCategory]);

  /**
   * Create a new service with tiers
   */
  const handleCreateService = useCallback(async (
    serviceName: string,
    tiers: TierData[]
  ): Promise<Service[] | null> => {
    const result = await createService(selectedVehicle, selectedCategory, serviceName, tiers);
    
    if (result) {
      // Add a small delay to ensure the database transaction is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      return await refreshServices();
    }
    return null;
  }, [createService, selectedVehicle, selectedCategory, refreshServices]);

  /**
   * Update an existing service
   */
  const handleUpdateService = useCallback(async (
    serviceId: string,
    serviceName: string,
    tiers: TierData[]
  ): Promise<Service[] | null> => {
    // Map vehicle ID to backend format using shared utility
    const { getBackendEndpoint } = await import('@/shared/utils/vehicleMapping');
    
    // Map category ID to backend format
    const categoryMap: { [key: string]: number } = {
      'interior': 1,
      'exterior': 2,
      'service-packages': 3,
      'ceramic-coating': 4,
      'paint-correction': 5,
      'paint-protection-film': 6,
      'addons': 7
    };
    
    const serviceData = {
      tenant_id: tenantId,
      vehicle_id: getBackendEndpoint(selectedVehicle),
      service_category_id: categoryMap[selectedCategory] || 3,
      name: serviceName,
      description: serviceName + ' service',
      base_price_cents: Math.round((tiers[0]?.price || 0) * 100),
      tiers: tiers
    };
    
    const result = await updateService(serviceId, serviceData);
    
    if (result) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return await refreshServices();
    }
    return null;
  }, [updateService, tenantId, selectedVehicle, selectedCategory, refreshServices]);

  /**
   * Delete a service
   */
  const handleDeleteService = useCallback(async (
    serviceId: string
  ): Promise<boolean> => {
    return await deleteService(serviceId);
  }, [deleteService]);

  return {
    refreshServices,
    handleCreateService,
    handleUpdateService,
    handleDeleteService
  };
}

