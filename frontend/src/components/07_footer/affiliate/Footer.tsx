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

  // Convert service_areas array to the format expected by FooterGrid
  const serviceAreas = affiliateData?.service_areas?.map(area => {
    const parts = area.split(', ');
    return {
      city: parts[0] || '',
      state: parts[1] || ''
    };
  }) || [];

  // Combine affiliate data with MDH social media config
  const combinedConfig = {
    ...affiliateData,
    base_location: affiliateData?.base_location, // Ensure base_location is passed through
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