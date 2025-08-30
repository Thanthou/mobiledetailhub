import { useState, useEffect, useCallback } from 'react';
import { Car, Truck, Home, Bot as Boat, Bike, Mountain, HelpCircle } from 'lucide-react';
import type { Vehicle } from '../types';

// Mapping from frontend IDs to database IDs
const VEHICLE_ID_MAP: Record<string, number> = {
  'cars': 1,
  'trucks': 2,
  'rvs': 3,
  'boats': 4,
  'motorcycles': 5,
  'offroad': 6,
  'other': 7
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
export const useServicesAPI = (affiliateId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchServices = useCallback(async (vehicleId: string, categoryId: string) => {
    // Prevent multiple simultaneous calls
    if (isFetching) {
      return null;
    }
    
    // Validate affiliate ID is provided
    if (!affiliateId || affiliateId === '') {
      // Don't set error for missing affiliate ID - just return early
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
      
      const response = await fetch(`/api/services/affiliate/${affiliateId}/vehicle/${vehicleId}/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      return null;
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [affiliateId, isFetching]);

  const createService = useCallback(async (vehicleId: string, categoryId: string, serviceTitle: string) => {
    // Validate affiliate ID is provided
    if (!affiliateId || affiliateId === '') {
      // Don't set error for missing affiliate ID - just return early
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
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliate_id: parseInt(affiliateId),
          vehicle_id: dbVehicleId,
          service_category_id: dbCategoryId,
          base_price_cents: 0, // Default base price, can be updated later
          name: serviceTitle,
          description: `${serviceTitle} service for ${vehicleId} ${categoryId}`
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      return null;
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  const fetchServiceById = useCallback(async (serviceId: string) => {
    // Validate affiliate ID is provided
    if (!affiliateId || affiliateId === '') {
      // Don't set error for missing affiliate ID - just return early
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service');
      return null;
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  return {
    fetchServices,
    fetchServiceById,
    createService,
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
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
          id: 'interior',
          name: 'Interior',
          color: 'bg-gray-600',
          services: []
        },
        {
          id: 'exterior',
          name: 'Exterior',
          color: 'bg-blue-600',
          services: []
        },
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
        },
        {
          id: 'ceramic-coating',
          name: 'Ceramic Coating',
          color: 'bg-purple-600',
          services: []
        },
        {
          id: 'paint-correction',
          name: 'Paint Correction',
          color: 'bg-orange-600',
          services: []
        },
        {
          id: 'paint-protection-film',
          name: 'Paint Protection Film',
          color: 'bg-red-600',
          services: []
        }
      ]
    }
  ]);

  const toggleTierEnabled = (tierId: string) => {
    // Implementation for toggling tier enabled/disabled state
  };

  return {
    vehicles,
    toggleTierEnabled
  };
};