import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';
import type { Service } from '../types';

const getAddonTypeFromServiceName = (serviceName: string): 'wheels' | 'windows' | 'trim' | undefined => {
  const name = serviceName.toLowerCase();
  if (name.includes('wheel')) return 'wheels';
  if (name.includes('window')) return 'windows';
  if (name.includes('trim') || name.includes('interior')) return 'trim';
  return undefined;
};

const vehicleMap: Record<string, string> = {
  car: 'cars',
  truck: 'trucks',
  rv: 'rvs',
  boat: 'boats',
  motorcycle: 'motorcycles',
};

export const useAddonData = (selectedVehicle: string, selectedService: string) => {
  const [availableAddons, setAvailableAddons] = useState<Service[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [selectedTierForAddon, setSelectedTierForAddon] = useState<Record<string, string>>({});
  const { businessSlug } = useSiteContext();
  const { affiliateData } = useAffiliate();

  // Derived + stabilized values
  const affiliateId = affiliateData?.id;
  const backendVehicleId = useMemo(
    () => vehicleMap[selectedVehicle] || 'cars',
    [selectedVehicle]
  );

  // Debounce + abort control + race guard
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);

  const canFetch =
    Boolean(selectedVehicle && selectedService && affiliateId && businessSlug);

  const fetchAddonsOnce = useCallback(async () => {
    if (!canFetch) {
      setAvailableAddons([]);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const seq = ++requestSeq.current;
    setLoadingAddons(true);

    const url = `/api/services/affiliate/${affiliateId}/vehicle/${backendVehicleId}/category/7`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Failed to fetch addons: ${response.statusText}`);

      const json = await response.json();
      const processed: Service[] =
        (json.data || []).map((addon: any) => ({
          ...addon,
          tiers: addon.tiers?.map((tier: any) => ({
            ...tier,
            addonType: getAddonTypeFromServiceName(addon.name),
          })) ?? [],
        }));

      // Only apply latest response
      if (seq === requestSeq.current) {
        setAvailableAddons(processed);
      }
    } catch (err) {
      if ((err as any)?.name !== 'AbortError') {
        console.error('Error fetching addons:', err);
        if (seq === requestSeq.current) setAvailableAddons([]);
      }
    } finally {
      if (seq === requestSeq.current) setLoadingAddons(false);
    }
  }, [affiliateId, backendVehicleId, businessSlug, selectedService, canFetch]);

  useEffect(() => {
    // Debounce rapid changes
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchAddonsOnce();
    }, 250); // adjust delay to taste

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // Don’t abort here; allow latest fetch to proceed unless inputs change again
    };
  }, [fetchAddonsOnce]);

  const toggleAddon = useCallback((addonId: string, tierId: string) => {
    setSelectedTierForAddon(prev => {
      if (prev[addonId] === tierId) {
        const next = { ...prev };
        delete next[addonId];
        return next;
      }
      return { ...prev, [addonId]: tierId };
    });
  }, []);

  const clearAddonSelection = useCallback(() => setSelectedTierForAddon({}), []);

  return {
    availableAddons,
    loadingAddons,
    selectedTierForAddon,
    toggleAddon,
    clearAddonSelection,
  };
};
