import { useCallback, useEffect, useState } from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';

import type { Service } from '../types';

export const useServiceData = (selectedVehicle: string) => {
  const { isAffiliate } = useSiteContext();
  const { affiliateData } = useAffiliate();
  
  const [selectedService, setSelectedService] = useState<string>('');
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Map frontend vehicle IDs to backend vehicle IDs
  const vehicleMap: { [key: string]: string } = {
    'car': 'cars',
    'truck': 'trucks', 
    'rv': 'rvs',
    'boat': 'boats',
    'motorcycle': 'motorcycles'
  };

  // Fetch services for selected vehicle
  useEffect(() => {
    if (selectedVehicle && isAffiliate && affiliateData?.id) {
      const fetchServices = async () => {
        setLoadingServices(true);
        const backendVehicleId = vehicleMap[selectedVehicle];
        
        if (backendVehicleId) {
          try {
            const url = `/api/services/affiliate/${String(affiliateData.id)}/vehicle/${backendVehicleId}/category/service-packages`;
            const response = await fetch(url);
            
            if (response.ok) {
              const data = await response.json() as { success: boolean; data: Service[] };
              
              if (data.success) {
                setAvailableServices(data.data);
                // Auto-select the first service if available
                if (data.data.length > 0) {
                  setSelectedService(data.data[0].id);
                }
              }
            } else {
              console.error('Services API error:', response.status, response.statusText);
            }
          } catch (error) {
            console.error('Error fetching services:', error);
            setAvailableServices([]);
          }
        }
        setLoadingServices(false);
      };
      
      void fetchServices();
      setSelectedService(''); // Reset service selection
    } else if (selectedVehicle) {
      // For MDH site, show empty services for now
      setAvailableServices([]);
    }
  }, [selectedVehicle, isAffiliate, affiliateData]);

  const selectService = useCallback((serviceId: string) => {
    setSelectedService(serviceId);
  }, []);

  const clearServiceSelection = useCallback(() => {
    setSelectedService('');
  }, []);

  return {
    selectedService,
    availableServices,
    loadingServices,
    selectService,
    clearServiceSelection,
  };
};
