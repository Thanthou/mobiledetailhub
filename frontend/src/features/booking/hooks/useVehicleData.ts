import { useCallback, useEffect, useState } from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';

import { getMakesForType, getModelsForMake, getVehicleYears } from '@/data';
import { vehicles } from '../data/vehicles';
import type { Service, Vehicle } from '../types';

export const useVehicleData = () => {
  const { isAffiliate } = useSiteContext();
  const { affiliateData, isLoading: affiliateLoading } = useAffiliate();
  
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    length: '',
  });

  // Get makes and models based on selected vehicle type
  const vehicleTypeForData = ['truck', 'suv'].includes(selectedVehicle || '') ? 'car' : (selectedVehicle || 'car');
  const vehicleMakes = getMakesForType(vehicleTypeForData);
  const vehicleModels: { [make: string]: string[] } = {};
  vehicleMakes.forEach((make) => {
    vehicleModels[make] = getModelsForMake(vehicleTypeForData, make);
  });
  const vehicleYears = getVehicleYears().map(year => year.toString());
  const vehicleColors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Orange', 'Yellow', 'Purple', 'Beige', 'Tan', 'Maroon', 'Navy', 'Forest Green', 'Burgundy', 'Champagne', 'Pearl'];

  // Filter vehicles based on affiliate's available services
  useEffect(() => {
    if (isAffiliate && affiliateData?.id) {
      const checkVehicleServices = async () => {
        setLoadingVehicles(true);
        const vehiclesWithServices: Vehicle[] = [];
        
        // Map frontend vehicle IDs to backend vehicle IDs
        const vehicleMap: { [key: string]: string } = {
          'car': 'cars',
          'truck': 'trucks', 
          'rv': 'rvs',
          'boat': 'boats',
          'motorcycle': 'motorcycles'
        };
        
        // Check each vehicle type to see if it has any services
        for (const vehicle of vehicles) {
          const backendVehicleId = vehicleMap[vehicle.id];
          if (backendVehicleId) {
            try {
              // Check if this vehicle type has any services for this affiliate
              const response = await fetch(`/api/services/affiliate/${String(affiliateData.id)}/vehicle/${backendVehicleId}/category/service-packages`);
              if (response.ok) {
                const data = await response.json() as { success: boolean; data: Service[] };
                if (data.success && data.data.length > 0) {
                  vehiclesWithServices.push(vehicle);
                }
              }
            } catch (error) {
              console.error(`Error checking services for ${vehicle.id}:`, error);
            }
          }
        }
        
        setAvailableVehicles(vehiclesWithServices);
        setLoadingVehicles(false);
      };
      
      void checkVehicleServices();
    } else if (!isAffiliate) {
      // For MDH site, show all vehicles
      setAvailableVehicles(vehicles);
    }
  }, [isAffiliate, affiliateData]);

  const selectVehicle = useCallback((vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  }, []);

  const clearVehicleSelection = useCallback(() => {
    setSelectedVehicle('');
  }, []);

  const updateVehicleDetails = useCallback((details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => {
    setVehicleDetails(details);
  }, []);

  const clearVehicleDetails = useCallback(() => {
    setVehicleDetails({
      make: '',
      model: '',
      year: '',
      color: '',
      length: '',
    });
  }, []);

  return {
    selectedVehicle,
    availableVehicles,
    loadingVehicles,
    affiliateLoading,
    vehicleMakes,
    vehicleModels,
    vehicleYears,
    vehicleColors,
    vehicleDetails,
    selectVehicle,
    clearVehicleSelection,
    updateVehicleDetails,
    clearVehicleDetails,
  };
};