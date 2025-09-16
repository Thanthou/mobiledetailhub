import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSiteContext } from '@/shared/hooks';
import { VEHICLE_MAPPINGS } from '@/shared/utils/vehicleMapping';

interface Service {
  id: number;
  business_id: number;
  service_name: string;
  service_description: string;
  service_category: string;
  service_type: string;
  vehicle_types: number[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  metadata: any;
}

interface VehicleType {
  id: string;
  name: string;
  icon: string;
}

// Map vehicle type IDs to their names and icons using vehicleMapping
const VEHICLE_TYPE_MAP: Record<number, { name: string; icon: string }> = {
  1: { name: 'Car', icon: 'Car' },
  2: { name: 'Truck', icon: 'Truck' },
  3: { name: 'SUV', icon: 'Car' },
  4: { name: 'RV', icon: 'Home' },
  5: { name: 'Boat', icon: 'Anchor' },
  6: { name: 'Motorcycle', icon: 'Bike' },
};

export function useAffiliateServices() {
  const { businessSlug, isMDH } = useSiteContext();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['affiliate-services', businessSlug],
    queryFn: async (): Promise<Service[]> => {
      if (!businessSlug) {
        // For MDH main site, return default vehicle types
        return [];
      }
      
      const response = await fetch(`/api/affiliates/${businessSlug}/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch affiliate services');
      }
      return response.json();
    },
    enabled: !!businessSlug,
  });

  // Extract unique vehicle types from services using vehicleMapping
  const vehicleTypes: VehicleType[] = React.useMemo(() => {
    // For MDH main site, show default vehicle types
    if (isMDH || !businessSlug) {
      return [
        { id: '1', name: 'Car', icon: 'Car' },
        { id: '2', name: 'Truck', icon: 'Truck' },
        { id: '4', name: 'RV', icon: 'Home' },
        { id: '5', name: 'Boat', icon: 'Anchor' },
        { id: '6', name: 'Motorcycle', icon: 'Bike' },
      ];
    }

    if (!services) return [];

    const uniqueVehicleTypeIds = new Set<number>();
    
    services.forEach(service => {
      service.vehicle_types?.forEach(vehicleTypeId => {
        uniqueVehicleTypeIds.add(vehicleTypeId);
      });
    });

    return Array.from(uniqueVehicleTypeIds)
      .map(id => {
        const vehicleInfo = VEHICLE_TYPE_MAP[id];
        if (vehicleInfo) {
          return {
            id: id.toString(),
            name: vehicleInfo.name,
            icon: vehicleInfo.icon,
          };
        }
        return null;
      })
      .filter(Boolean) as VehicleType[];
  }, [services, isMDH, businessSlug]);

  return {
    services,
    vehicleTypes,
    isLoading,
    error,
  };
}
