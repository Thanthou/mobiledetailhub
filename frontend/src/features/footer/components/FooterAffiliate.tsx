import React from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { getAffiliateDisplayLocation } from '@/features/affiliateDashboard/utils';
import { useLocation, useMDHConfig, useSiteContext } from '@/shared/hooks';

// Define types locally since they're not exported
interface AffiliateData {
  service_areas?: unknown;
  business_name?: string;
  base_location?: {
    city: string | null;
    state_code: string | null;
    state_name: string | null;
    zip: string | null;
    lat: number | null;
    lng: number | null;
  } | null;
}

interface AffiliateContextType {
  affiliateData: AffiliateData | null;
  isLoading: boolean;
  error: string | null;
  businessSlug: string | null;
}

interface LocationContextType {
  selectedLocation: {
    city: string;
    state: string;
    zipCode: string;
    fullLocation: string;
  } | null;
  setSelectedLocation: (location: { city: string; state: string; zipCode: string; fullLocation: string } | null) => void;
  clearLocation: () => void;
  updateLocationWithState: (city: string, state: string) => void;
  hasValidLocation: () => boolean;
}

import FooterBottom from './FooterBottom';
import FooterErrorState from './FooterErrorState';
import FooterGrid from './FooterGrid';
import FooterLoadingState from './FooterLoadingState';

// Type definitions
interface ServiceAreaData {
  city: string;
  state: string;
  primary: boolean;
}



interface CombinedConfig {
  id?: number;
  slug?: string;
  business_name?: string;
  owner?: string;
  email?: string | undefined;
  phone?: string;
  sms_phone?: string;
  base_location?: {
    city?: string | null;
    state_code?: string | null;
    state_name?: string | null;
    zip?: string | null;
    lat?: number | null;
    lng?: number | null;
  } | null;
  service_areas?: ServiceAreaData[] | string | null;
  services?: unknown;
  website_url?: string;
  gbp_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  application_status?: string;
  has_insurance?: boolean;
  source?: string;
  notes?: string;
  uploads?: unknown;
  business_license?: string;
  insurance_provider?: string;
  insurance_expiry?: string;
  service_radius_miles?: number;
  operating_hours?: unknown;
  emergency_contact?: unknown;
  total_jobs?: number;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  application_date?: string;
  last_activity?: string;
  // MDH config properties
  facebook?: string | undefined;
  instagram?: string | undefined;
  tiktok?: string | undefined;
  youtube?: string | undefined;
}

interface AffiliateFooterProps {
  onRequestQuote: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
}

const AffiliateFooter: React.FC<AffiliateFooterProps> = ({ onRequestQuote, onBookNow, onQuoteHover }) => {
  const siteContext = useSiteContext();
  const affiliateContext = useAffiliate() as AffiliateContextType;
  const mdhContext = useMDHConfig();
  const locationContext = useLocation() as LocationContextType;
  
  const businessSlug = siteContext.businessSlug;
  const affiliateData = affiliateContext.affiliateData;
  const affiliateLoading = affiliateContext.isLoading;
  const affiliateError = affiliateContext.error;
  const mdhConfig = mdhContext.mdhConfig;
  const mdhLoading = mdhContext.isLoading;
  const mdhError = mdhContext.error;
  const selectedLocation = locationContext.selectedLocation;

  const isLoading = affiliateLoading || mdhLoading;
  const hasError = Boolean(affiliateError || mdhError);

  // Convert service_areas JSON to the format expected by FooterGrid
  const serviceAreas = React.useMemo((): Array<{ city: string; state: string; primary?: boolean }> => {
    if (!affiliateData?.service_areas) return [];
    
    let serviceAreasData: unknown = affiliateData.service_areas;
    if (typeof serviceAreasData === 'string') {
      try {
        serviceAreasData = JSON.parse(serviceAreasData);
      } catch (error) {
        console.error('Error parsing service_areas JSON:', error);
        return [];
      }
    }
    
    if (Array.isArray(serviceAreasData)) {
      // Sort by state, with primary location first
      return serviceAreasData
        .map((area: unknown): { city: string; state: string; primary?: boolean } => {
          const areaData = area as { city?: string; state?: string; primary?: boolean };
          return {
            city: areaData.city || '',
            state: areaData.state || '',
            primary: areaData.primary || false
          };
        })
        .sort((a, b) => {
          // Primary locations first
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          
          // Then sort by state
          if (a.state !== b.state) {
            return (a.state || '').localeCompare(b.state || '');
          }
          
          // Finally sort by city within the same state
          return (a.city || '').localeCompare(b.city || '');
        });
    }
    
    return [];
  }, [affiliateData]);

  // Get the appropriate location to display (selected location if served, otherwise primary)
  const displayLocation = React.useMemo(() => {
    if (!affiliateData || !selectedLocation) return null;
    return getAffiliateDisplayLocation(affiliateData.service_areas as string | ServiceAreaData[] | null, selectedLocation);
  }, [affiliateData, selectedLocation]);

  // Combine affiliate data with MDH social media config
  const combinedConfig: CombinedConfig = {
    ...(affiliateData || {}),
    service_areas: affiliateData?.service_areas as string | ServiceAreaData[] | null,
    base_location: displayLocation ? {
      city: displayLocation.city,
      state_name: displayLocation.state,
      zip: '', // We don't have zip in displayLocation, but it's not critical for footer
      state_code: null,
      lat: null,
      lng: null
    } : affiliateData?.base_location || null, // Fallback to existing base_location
    email: mdhConfig?.email, // Use MDH email instead of affiliate email
    facebook: mdhConfig?.facebook,
    instagram: mdhConfig?.instagram,
    tiktok: mdhConfig?.tiktok,
    youtube: mdhConfig?.youtube,
  };



  if (isLoading) return <FooterLoadingState />;
  if (hasError || !affiliateData || !mdhConfig) return <FooterErrorState />;

  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <FooterGrid 
          parentConfig={{
            phone: combinedConfig.phone,
            email: combinedConfig.email,
            facebook: combinedConfig.facebook,
            instagram: combinedConfig.instagram,
            tiktok: combinedConfig.tiktok,
            youtube: combinedConfig.youtube,
            base_location: combinedConfig.base_location ? {
              city: combinedConfig.base_location.city,
              state_name: combinedConfig.base_location.state_name
            } : undefined,
            name: combinedConfig.business_name
          } as {
            phone?: string;
            email?: string;
            facebook?: string;
            instagram?: string;
            tiktok?: string;
            youtube?: string;
            base_location?: { city?: string; state_name?: string };
            name?: string;
          }} 
          businessSlug={businessSlug || ''}
          serviceAreas={serviceAreas}
          serviceAreasData={affiliateData.service_areas}
          onRequestQuote={onRequestQuote}
          onBookNow={onBookNow ?? (() => {})}
          onQuoteHover={onQuoteHover ?? (() => {})}
        />
        <FooterBottom businessInfo={{ name: affiliateData.business_name || 'Your Business' }} />
      </div>
    </footer>
  );
};

export default AffiliateFooter;
