import { useCallback, useEffect, useState } from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';

import type { Service } from '../types';

// Helper function to determine addon type from service name
const getAddonTypeFromServiceName = (serviceName: string): 'wheels' | 'windows' | 'trim' | undefined => {
  const name = serviceName.toLowerCase();
  if (name.includes('wheel')) return 'wheels';
  if (name.includes('window')) return 'windows';
  if (name.includes('trim') || name.includes('interior')) return 'trim';
  return undefined;
};

export const useAddonData = (selectedVehicle: string, selectedService: string) => {
  const [availableAddons, setAvailableAddons] = useState<Service[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [selectedTierForAddon, setSelectedTierForAddon] = useState<{ [addonId: string]: string }>({});
  const { businessSlug } = useSiteContext();
  const { affiliateData } = useAffiliate();

  const fetchAddons = useCallback(async () => {
    const affiliateId = affiliateData?.id;
    
    // Map frontend vehicle IDs to backend vehicle IDs
    const vehicleMap: { [key: string]: string } = {
      'car': 'cars',
      'truck': 'trucks', 
      'rv': 'rvs',
      'boat': 'boats',
      'motorcycle': 'motorcycles'
    };
    
    const backendVehicleId = vehicleMap[selectedVehicle] || 'cars';
    
    if (!selectedVehicle || !selectedService || !affiliateId || !businessSlug) {
      setAvailableAddons([]);
      return;
    }

    setLoadingAddons(true);
    const url = `/api/services/affiliate/${affiliateId}/vehicle/${backendVehicleId}/category/7`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch addons: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process the addon data to include addon type information
      const processedAddons = (data.data || []).map((addon: any) => ({
        ...addon,
        tiers: addon.tiers?.map((tier: any) => ({
          ...tier,
          addonType: getAddonTypeFromServiceName(addon.name)
        })) || []
      }));
      
      setAvailableAddons(processedAddons);
    } catch (error) {
      console.error('Error fetching addons:', error);
      setAvailableAddons([]);
    } finally {
      setLoadingAddons(false);
    }
  }, [selectedVehicle, selectedService, affiliateData, businessSlug]);

  const toggleAddon = useCallback((addonId: string, tierId: string) => {
    setSelectedTierForAddon(prev => {
      // If this tier is already selected, deselect it
      if (prev[addonId] === tierId) {
        const newState = { ...prev };
        delete newState[addonId];
        return newState;
      }
      // Otherwise, select this tier for this addon
      return {
        ...prev,
        [addonId]: tierId
      };
    });
  }, []);

  const clearAddonSelection = useCallback(() => {
    setSelectedTierForAddon({});
  }, []);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  return {
    availableAddons,
    loadingAddons,
    selectedTierForAddon,
    toggleAddon,
    clearAddonSelection,
  };
};
