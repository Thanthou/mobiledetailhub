import React from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterLoadingState from '../FooterLoadingState';
import FooterErrorState from '../FooterErrorState';
import { useSiteContext } from '../../../hooks/useSiteContext';
import { useAffiliate } from '../../../contexts/AffiliateContext';
import { useMDHConfig } from '../../../contexts/MDHConfigContext';

interface AffiliateFooterProps {
  onRequestQuote: () => void;
  onBookNow?: () => void;
  onQuoteHover?: () => void;
}

const AffiliateFooter: React.FC<AffiliateFooterProps> = ({ onRequestQuote, onBookNow, onQuoteHover }) => {
  const { businessSlug } = useSiteContext();
  const { affiliateData, isLoading: affiliateLoading, error: affiliateError } = useAffiliate();
  const { mdhConfig, isLoading: mdhLoading, error: mdhError } = useMDHConfig();

  const isLoading = affiliateLoading || mdhLoading;
  const hasError = affiliateError || mdhError;

  // Convert service_areas JSON to the format expected by FooterGrid
  const serviceAreas = React.useMemo(() => {
    if (!affiliateData?.service_areas) return [];
    
    let serviceAreasData = affiliateData.service_areas;
    if (typeof serviceAreasData === 'string') {
      try {
        serviceAreasData = JSON.parse(serviceAreasData);
      } catch (e) {
        console.error('Error parsing service_areas JSON:', e);
        return [];
      }
    }
    
    if (Array.isArray(serviceAreasData)) {
      // Sort by state, with primary location first
      return serviceAreasData
        .map(area => ({
          city: area.city || '',
          state: area.state || '',
          primary: area.primary || false
        }))
        .sort((a, b) => {
          // Primary locations first
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          
          // Then sort by state
          if (a.state !== b.state) {
            return a.state.localeCompare(b.state);
          }
          
          // Finally sort by city within the same state
          return a.city.localeCompare(b.city);
        });
    }
    
    return [];
  }, [affiliateData?.service_areas]);

  // Extract primary service area for base_location
  const primaryServiceArea = React.useMemo(() => {
    if (!affiliateData?.service_areas) return null;
    
    let serviceAreasData = affiliateData.service_areas;
    if (typeof serviceAreasData === 'string') {
      try {
        serviceAreasData = JSON.parse(serviceAreasData);
      } catch (e) {
        console.error('Error parsing service_areas JSON:', e);
        return null;
      }
    }
    
    if (Array.isArray(serviceAreasData)) {
      return serviceAreasData.find(area => area.primary === true) || null;
    }
    
    return null;
  }, [affiliateData?.service_areas]);

  // Combine affiliate data with MDH social media config
  const combinedConfig = {
    ...affiliateData,
    base_location: primaryServiceArea ? {
      city: primaryServiceArea.city,
      state_name: primaryServiceArea.state,
      zip: primaryServiceArea.zip
    } : affiliateData?.base_location, // Fallback to existing base_location
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
          parentConfig={combinedConfig} 
          businessSlug={businessSlug}
          serviceAreas={serviceAreas}
          onRequestQuote={onRequestQuote}
          onBookNow={onBookNow}
          onQuoteHover={onQuoteHover}
        />
        <FooterBottom businessInfo={{ name: affiliateData.name || 'Your Business' }} />
      </div>
    </footer>
  );
};

export default AffiliateFooter;