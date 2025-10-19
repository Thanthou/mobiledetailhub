/**
 * Hook for managing service selection and automatic data fetching
 * Handles vehicle/category changes and keeps service list in sync
 */

import { useEffect, useRef, useState } from 'react';

import type { Service } from '../types';
import { transformServiceData } from './useServiceOperations';

interface UseServiceSelectionProps {
  selectedVehicle: string;
  selectedCategory: string;
  affiliateId: string | undefined;
  fetchServices: (vehicleType: string, category: string) => Promise<unknown>;
}

export function useServiceSelection({
  selectedVehicle,
  selectedCategory,
  affiliateId,
  fetchServices
}: UseServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentServiceData, setCurrentServiceData] = useState<Service | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const lastFetchRef = useRef<string>('');

  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && affiliateId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches for the same combination
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        void fetchServices(selectedVehicle, selectedCategory)
          .then((data: unknown) => {
            if (data && Array.isArray(data) && data.length > 0) {
              const services = transformServiceData(data);
              setAvailableServices(services);
              
              // If no service is currently selected, select the first one
              if (!selectedService && services.length > 0) {
                const firstService = services[0];
                if (firstService) {
                  setSelectedService(firstService.id);
                  setCurrentServiceData(firstService);
                }
              } else if (selectedService) {
                // Find the currently selected service in the new list
                const currentService = services.find(s => s.id === selectedService);
                if (currentService) {
                  setCurrentServiceData(currentService);
                } else if (services.length > 0) {
                  // If the selected service is not in the new list, select the first one
                  const firstService = services[0];
                  if (firstService) {
                    setSelectedService(firstService.id);
                    setCurrentServiceData(firstService);
                  }
                }
              }
            } else {
              setCurrentServiceData(null);
              setAvailableServices([]);
              setSelectedService('');
            }
          })
          .catch((err: unknown) => {
            console.error('Error fetching services:', err);
            setCurrentServiceData(null);
            setAvailableServices([]);
            setSelectedService('');
          });
      }, 100);
      
      return () => { clearTimeout(timeoutId); };
    }
  }, [selectedVehicle, selectedCategory, affiliateId, fetchServices, selectedService]);

  // Effect to handle service selection changes
  useEffect(() => {
    if (selectedService && availableServices.length > 0) {
      const selectedServiceData = availableServices.find(service => service.id === selectedService);
      if (selectedServiceData) {
        setCurrentServiceData(selectedServiceData);
      }
    }
  }, [selectedService, availableServices]);

  return {
    selectedService,
    setSelectedService,
    currentServiceData,
    setCurrentServiceData,
    availableServices,
    setAvailableServices
  };
}

