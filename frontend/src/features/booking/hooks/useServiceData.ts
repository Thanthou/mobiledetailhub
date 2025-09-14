import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';
import type { Service } from '../types';

const vehicleMap: Record<string, string> = { 
  car: 'cars', 
  truck: 'trucks', 
  rv: 'rvs', 
  boat: 'boats', 
  motorcycle: 'motorcycles' 
};

type UseServiceDataRQOptions = {
  /** If true, select first service when a fresh list loads (defaults to false) */
  autoSelectFirst?: boolean;
};

export function useServiceData(
  selectedVehicle: string, 
  { autoSelectFirst = false }: UseServiceDataRQOptions = {}
) {
  const { isAffiliate } = useSiteContext();
  const { affiliateData } = useAffiliate();

  const [selectedService, setSelectedService] = useState<string>('');

  const affiliateId = affiliateData?.id ? String(affiliateData.id) : '';
  const backendVehicleId = useMemo(
    () => (selectedVehicle ? vehicleMap[selectedVehicle] : undefined),
    [selectedVehicle]
  );

  const enabled = !!(isAffiliate && affiliateId && backendVehicleId);

  const query = useQuery<Service[], Error, Service[]>({
    queryKey: ['services', affiliateId, backendVehicleId],
    enabled,
    staleTime: 5 * 60_000, // 5 minutes
    gcTime: 10 * 60_000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
    queryFn: async ({ signal }) => {
      const url = `/api/services/affiliate/${affiliateId}/vehicle/${backendVehicleId}/category/service-packages`;
      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`Services API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json() as { success: boolean; data: Service[] };
      if (!json.success) {
        throw new Error('Invalid response format from services API');
      }
      return json.data || [];
    },
  });

  const availableServices = query.data || [];

  // Auto-select first service if enabled and no service is selected
  useEffect(() => {
    if (autoSelectFirst && availableServices.length > 0 && !selectedService) {
      setSelectedService(availableServices[0]?.id ?? '');
    }
  }, [autoSelectFirst, availableServices, selectedService]);

  // Clear selection if selected service no longer exists
  useEffect(() => {
    if (selectedService && availableServices.length > 0) {
      const stillExists = availableServices.some(s => s.id === selectedService);
      if (!stillExists) {
        setSelectedService('');
      }
    }
  }, [availableServices, selectedService]);

  const selectService = useCallback((serviceId: string) => {
    setSelectedService(serviceId);
  }, []);

  const clearServiceSelection = useCallback(() => {
    setSelectedService('');
  }, []);

  return {
    // data
    availableServices,
    selectedService,
    
    // status
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
    error: query.error ? { 
      message: query.error.message, 
      status: (query.error as any)?.status 
    } : null,
    
    // actions
    selectService,
    clearServiceSelection,
    
    // React Query specific
    refetch: query.refetch,
    isStale: query.isStale,
  };
}

// Export as alias for backward compatibility
export const useServiceDataRQ = useServiceData;
