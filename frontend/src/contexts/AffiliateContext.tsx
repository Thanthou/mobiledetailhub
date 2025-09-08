import React, { createContext, type ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { config } from '../config/environment';
import { useLocation } from '../hooks/useLocation';

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
}

export const AffiliateProvider: React.FC<AffiliateProviderProps> = ({ children }) => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const { updateLocationWithState, selectedLocation } = useLocation();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessSlug) {
      setIsLoading(false);
      return;
    }

    const fetchAffiliateData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiUrl}/api/affiliates/${businessSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch affiliate data: ${response.status.toString()}`);
        }
        
        const data = await response.json() as { success: boolean; affiliate?: AffiliateData };
        
        if (data.success) {
          setAffiliateData(data.affiliate);
        } else {
          throw new Error('Invalid affiliate data structure');
        }
      } catch (err) {
        console.error('Error fetching affiliate data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch affiliate data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAffiliateData();
  }, [businessSlug]);

  // Update location when affiliate data loads (only if no valid location is currently selected)
  useEffect(() => {
    if (affiliateData?.service_areas) {
      // Only update location if no valid location is currently selected
      if (!selectedLocation.city || !selectedLocation.state) {
        // Parse service areas to find the primary location
        let serviceAreasData = affiliateData.service_areas;
        if (typeof serviceAreasData === 'string') {
          try {
            serviceAreasData = JSON.parse(serviceAreasData) as ServiceArea[];
          } catch (e) {
            console.error('Error parsing service_areas JSON:', e);
            return;
          }
        }
        
        if (Array.isArray(serviceAreasData)) {
          // Find the primary service area (only elements with primary: true)
          const primaryArea = serviceAreasData.find(area => area.primary);
          
          if (primaryArea && primaryArea.city && primaryArea.state) {
            // Update location with affiliate's primary service area
            updateLocationWithState(primaryArea.city, primaryArea.state);
          }
        }
      }
    }
  }, [affiliateData, updateLocationWithState, selectedLocation]);

  const value: AffiliateContextType = {
    affiliateData,
    isLoading,
    error,
    businessSlug,
  };

  return (
    <AffiliateContext.Provider value={value}>
      {children}
    </AffiliateContext.Provider>
  );
};
