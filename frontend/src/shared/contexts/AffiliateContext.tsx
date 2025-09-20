import React, { createContext, type ReactNode, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { config } from '@/../config/env';
import { useLocation } from '@/shared/hooks/useLocation';

interface ServiceArea {
  city: string;
  state: string;
  zip?: number | null;
  primary: boolean;
  minimum: number;
  multiplier: number;
}

interface AffiliateData {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  email: string;
  phone: string;
  sms_phone: string;
  base_location: {
    city: string | null;
    state_code: string | null;
    state_name: string | null;
    zip: string | null;
    lat: number | null;
    lng: number | null;
  } | null;
  service_areas: ServiceArea[] | string | null;
  services: unknown;
  website_url: string;
  gbp_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  application_status: string;
  has_insurance: boolean;
  source: string;
  notes: string;
  uploads: unknown;
  business_license: string;
  insurance_provider: string;
  insurance_expiry: string;
  service_radius_miles: number;
  operating_hours: unknown;
  emergency_contact: unknown;
  total_jobs: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  application_date: string;
  approved_date: string;
  last_activity: string;
}

interface AffiliateContextType {
  affiliateData: AffiliateData | null;
  isLoading: boolean;
  error: string | null;
  businessSlug: string | null;
}

export const AffiliateContext = createContext<AffiliateContextType | null>(null);

interface AffiliateProviderProps {
  children: ReactNode;
  customBusinessSlug?: string;
}

export const AffiliateProvider: React.FC<AffiliateProviderProps> = ({ children, customBusinessSlug }) => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const { updateLocationWithState, selectedLocation } = useLocation();

  // Use custom business slug if provided, otherwise use URL param
  const effectiveBusinessSlug = customBusinessSlug || businessSlug;
  const enabled = !!effectiveBusinessSlug;

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['affiliate', effectiveBusinessSlug],
    enabled,
    keepPreviousData: true,
    staleTime: 5 * 60_000, // 5 minutes
    queryFn: async ({ signal }) => {
      const res = await fetch(`${config.apiUrl}/api/affiliates/${effectiveBusinessSlug}`, { signal });
      if (!res.ok) throw new Error(`Failed to fetch affiliate data: ${res.status}`);
      const json = (await res.json()) as { success: boolean; affiliate?: AffiliateData };
      if (!json.success || !json.affiliate) throw new Error('Invalid affiliate data structure');
      return json.affiliate;
    },
  });

  const affiliateData = data ?? null;
  const ctxError = error ? (error as Error).message : null;

  // Update location when affiliate data loads (only if no valid location is selected)
  useEffect(() => {
    if (!affiliateData?.service_areas) return;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hasLocation = Boolean(selectedLocation?.city && selectedLocation?.state);
    if (hasLocation) return;

    let areas: ServiceArea[] | null = null;
    if (Array.isArray(affiliateData.service_areas)) {
      areas = affiliateData.service_areas as ServiceArea[];
    } else if (typeof affiliateData.service_areas === 'string') {
      try {
        areas = JSON.parse(affiliateData.service_areas) as ServiceArea[];
      } catch {
        areas = null;
      }
    }

    if (areas && areas.length) {
      const primary = areas.find(a => a.primary);
      if (primary?.city && primary?.state && typeof updateLocationWithState === 'function') {
        updateLocationWithState(primary.city, primary.state);
      }
    }
  }, [affiliateData, selectedLocation, updateLocationWithState]);

  const value: AffiliateContextType = useMemo(
    () => ({
      affiliateData,
      isLoading: isLoading && !data, // initial load true only when no data yet
      error: ctxError,
      businessSlug: effectiveBusinessSlug ?? null,
    }),
    [affiliateData, isLoading, data, ctxError, effectiveBusinessSlug]
  );

  return <AffiliateContext.Provider value={value}>{children}</AffiliateContext.Provider>;
};
