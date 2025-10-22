import React from 'react';

import { useData, useTenantConfigLoader } from '@shared/hooks';
import { getIndustryLogo, getIndustryLogoAlt } from '@shared/utils';

const Logo: React.FC = () => {
  const { industry, siteConfig, isLoading: isDataLoading, isPreview } = useData();
  
  // Only fetch tenant config in live mode (not preview)
  const { data: tenantConfig, isLoading: isConfigLoading } = useTenantConfigLoader({
    enabled: !isPreview,
  });
  
  const isLoading = isDataLoading || (!isPreview && isConfigLoading);
  
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Simple: get logo based on mode
  const src = isPreview
    ? siteConfig?.logo?.url || getIndustryLogo(industry) // Preview: use siteConfig logo
    : tenantConfig?.branding.logo.url || getIndustryLogo(industry); // Live: tenant logo or fallback
  
  const alt = isPreview
    ? siteConfig?.logo?.alt || getIndustryLogoAlt(industry)
    : tenantConfig?.branding.businessName || getIndustryLogoAlt(industry);

  // During loading (including HMR), show a minimal placeholder
  if (isLoading && !src) {
    return (
      <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-gray-200 animate-pulse rounded flex-shrink-0" />
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
      aria-label={`${industry} home`}
    >
      <img 
        src={src} 
        alt={alt} 
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
        width={64}
        height={64}
        decoding="async"
        loading="eager"
      />
    </button>
  );
};

export default Logo;
