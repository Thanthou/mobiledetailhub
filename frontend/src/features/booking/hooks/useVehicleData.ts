// frontend/src/features/booking/hooks/useVehicleData.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';
import { getMakesForType, getModelsForMake, getVehicleYears } from '@/data';
import { vehicles } from '../data/vehicles';
import type { Service, Vehicle } from '../types';

type CacheEntry = { at: number; list: Vehicle[] };
const VEHICLE_AVAIL_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60_000; // 5 min

const vehicleMap: Record<string, string> = {
  car: 'cars',
  truck: 'trucks',
  rv: 'rvs',
  boat: 'boats',
  motorcycle: 'motorcycles',
};

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

  // ---- Derived lists (memoized; no work in render every time) ----
  const vehicleTypeForData = useMemo(
    () => (['truck', 'suv'].includes(selectedVehicle || '') ? 'car' : (selectedVehicle || 'car')),
    [selectedVehicle]
  );

  const vehicleMakes = useMemo(() => getMakesForType(vehicleTypeForData), [vehicleTypeForData]);

  const vehicleModels = useMemo(() => {
    const models: { [make: string]: string[] } = {};
    for (const make of vehicleMakes) models[make] = getModelsForMake(vehicleTypeForData, make);
    return models;
  }, [vehicleMakes, vehicleTypeForData]);

  const vehicleYears = useMemo(() => getVehicleYears().map(String), []);
  const vehicleColors = useMemo(
    () => ['White','Black','Silver','Gray','Red','Blue','Green','Brown','Gold','Orange','Yellow','Purple','Beige','Tan','Maroon','Navy','Forest Green','Burgundy','Champagne','Pearl'],
    []
  );

  // ---- Fetch available vehicles for this affiliate (parallel + cache) ----
  const abortRef = useRef<AbortController | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    // MDH site? show all and bail.
    if (!isAffiliate) {
      setAvailableVehicles(vehicles);
      setLoadingVehicles(false);
      abortRef.current?.abort();
      return;
    }
    // Wait until affiliate is loaded
    if (affiliateLoading || !affiliateData?.id) return;

    const affiliateId = String(affiliateData.id);
    const cacheKey = `${affiliateId}|service-packages`;
    const now = Date.now();
    const cached = VEHICLE_AVAIL_CACHE.get(cacheKey);
    if (cached && now - cached.at < CACHE_TTL_MS) {
      setAvailableVehicles(cached.list);
      setLoadingVehicles(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const thisSeq = ++seqRef.current;

    setLoadingVehicles(true);

    // Build requests (in parallel)
    const requests = vehicles.map(async (v) => {
      const backend = vehicleMap[v.id];
      if (!backend) return { v, ok: false as const };
      try {
        const res = await fetch(
          `/api/services/affiliate/${affiliateId}/vehicle/${backend}/category/service-packages`,
          { signal: controller.signal }
        );
        if (!res.ok) return { v, ok: false as const };
        const data = (await res.json()) as { success: boolean; data: Service[] };
        return { v, ok: data.success && data.data.length > 0 };
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return { v, ok: false as const };
        console.error(`Vehicle check failed for ${v.id}`, e);
        return { v, ok: false as const };
      }
    });

    (async () => {
      const results = await Promise.allSettled(requests);
      if (seqRef.current !== thisSeq) return; // newer run won

      const list: Vehicle[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ok) list.push(r.value.v);
      }
      // Fallback: if none returned, show none (or all, your choice)
      const finalList = list.length ? list : [];

      VEHICLE_AVAIL_CACHE.set(cacheKey, { at: Date.now(), list: finalList });
      setAvailableVehicles(finalList);
      setLoadingVehicles(false);
    })();

    return () => {
      controller.abort();
    };
  }, [isAffiliate, affiliateLoading, affiliateData?.id]);

  // ---- Actions ----
  const selectVehicle = useCallback((vehicleId: string) => setSelectedVehicle(vehicleId), []);
  const clearVehicleSelection = useCallback(() => setSelectedVehicle(''), []);
  const updateVehicleDetails = useCallback((details: {
    make: string; model: string; year: string; color: string; length: string;
  }) => setVehicleDetails(details), []);
  const clearVehicleDetails = useCallback(() =>
    setVehicleDetails({ make: '', model: '', year: '', color: '', length: '' }),
  []);

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
