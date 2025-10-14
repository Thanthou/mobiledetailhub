import { useCallback, useState } from 'react';
import { Bike, Bot as Boat, Car, HelpCircle, Home, Mountain, Truck } from 'lucide-react';

import type { Vehicle } from '../types';

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular: boolean;
  description?: string;
}

interface ServiceData {
  id: string;
  name: string;
  description: string;
  base_price_cents: number;
  tiers?: ServiceTier[];
  tenant_id: number;
  vehicle_id: number;
  service_category_id: number;
}

// Mapping from frontend IDs to database IDs
const VEHICLE_ID_MAP: Record<string, number> = {
  'cars': 1,
  'suv': 3, // SUV has its own database ID
  'trucks': 2,
  'rvs': 4,
  'boats': 5,
  'motorcycles': 6,
  'offroad': 7,
  'other': 8
};

const CATEGORY_ID_MAP: Record<string, number> = {
  'interior': 1,
  'exterior': 2, 
  'service-packages': 3,
  'addons': 7,
  'ceramic-coating': 4,
  'paint-correction': 5,
  'paint-protection-film': 6
};

// New hook for fetching services data from database
export const useServicesAPI = (tenantId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchServices = useCallback(async (vehicleId: string, categoryId: string) => {
    // Prevent multiple simultaneous calls
    if (isFetching) {
      return null;
    }
    
    // Validate tenant ID is provided
    if (!tenantId || tenantId === '') {
      // Don't set error for missing tenant ID - just return early
      return null;
    }
    
    setIsFetching(true);
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend IDs to database IDs
      const dbVehicleId = VEHICLE_ID_MAP[vehicleId];
      const dbCategoryId = CATEGORY_ID_MAP[categoryId];
      
      if (!dbVehicleId || !dbCategoryId) {
        throw new Error('Invalid vehicle or category ID');
      }
      
      const response = await fetch(`/api/services/tenant/${tenantId}/vehicle/${vehicleId}/category/${dbCategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json() as ApiResponse<ServiceData[]>;
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      return null;
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [tenantId, isFetching]);

  const createService = useCallback(async (vehicleId: string, categoryId: string, serviceTitle: string, tiers?: ServiceTier[]) => {
    // Validate tenant ID is provided
    if (!tenantId || tenantId === '') {
      // Don't set error for missing tenant ID - just return early
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend IDs to database IDs
      const dbVehicleId = VEHICLE_ID_MAP[vehicleId];
      const dbCategoryId = CATEGORY_ID_MAP[categoryId];
      
      if (!dbVehicleId || !dbCategoryId) {
        throw new Error('Invalid vehicle or category ID');
      }
      
      const requestBody: Partial<ServiceData> = {
        tenant_id: parseInt(tenantId),
        vehicle_id: dbVehicleId, // Send the database vehicle ID
        service_category_id: dbCategoryId,
        base_price_cents: 0, // Default base price, can be updated later
        name: serviceTitle,
        description: `${serviceTitle} service for ${vehicleId} ${categoryId}`
      };
      
      // Add tiers if provided
      if (tiers && tiers.length > 0) {
        requestBody.tiers = tiers;
      }
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as ApiResponse;
        throw new Error(errorData.message ?? 'Failed to create service');
      }
      
      const data = await response.json() as ApiResponse<ServiceData>;
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const fetchServiceById = useCallback(async (serviceId: string) => {
    // Validate tenant ID is provided
    if (!tenantId || tenantId === '') {
      // Don't set error for missing tenant ID - just return early
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      
      const data = await response.json() as ApiResponse<ServiceData>;
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const updateService = useCallback(async (serviceId: string, serviceData: Partial<ServiceData>) => {
    // Validate tenant ID is provided
    if (!tenantId || tenantId === '') {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as ApiResponse;
        throw new Error(errorData.message ?? 'Failed to update service');
      }
      
      const data = await response.json() as ApiResponse<ServiceData>;
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const deleteService = useCallback(async (serviceId: string) => {
    // Validate tenant ID is provided
    if (!tenantId || tenantId === '') {
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json() as ApiResponse;
        throw new Error(errorData.message ?? 'Failed to delete service');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      return false;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  return {
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    loading,
    error
  };
};

export const useServicesData = () => {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'cars',
      name: 'Cars',
      icon: Car,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'suv',
      name: 'SUV',
      icon: Car,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'trucks',
      name: 'Trucks',
      icon: Truck,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'rvs',
      name: 'RVs',
      icon: Home,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'boats',
      name: 'Boats',
      icon: Boat,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'motorcycles',
      name: 'Motorcycles',
      icon: Bike,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'offroad',
      name: 'Off-Road',
      icon: Mountain,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    },
    {
      id: 'other',
      name: 'Other',
      icon: HelpCircle,
      categories: [
        {
          id: 'service-packages',
          name: 'Service Packages',
          color: 'bg-green-600',
          services: []
        },
        {
          id: 'addons',
          name: 'Addons',
          color: 'bg-indigo-600',
          services: []
        }
      ]
    }
  ]);

  const toggleTierEnabled = () => {
    // Implementation for toggling tier enabled/disabled state
  };

  return {
    vehicles,
    toggleTierEnabled
  };
};