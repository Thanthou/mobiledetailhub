import React from 'react';

import { useTenantConfig } from '@/shared/hooks';
import type { Vertical } from '@/shared/types';
import { getTenantAssetUrl } from '@/shared/utils';

import { useData } from '../contexts/DataProvider';

const Logo: React.FC = () => {
  const { tenantConfig, logoUrl, isLoading } = useTenantConfig();
  const { industry } = useData();
  
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Use tenant config logo, fallback to industry default via asset locator
  const src = logoUrl || getTenantAssetUrl({
    vertical: industry as Vertical,
    type: 'logo',
  });
  const alt = tenantConfig?.branding.businessName || `${industry} Logo`;

  // During loading (including HMR), show a minimal placeholder
  if (isLoading && !src) {
    return (
      <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 animate-pulse rounded" />
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="flex items-center hover:opacity-80 transition-opacity"
      aria-label={`${industry} home`}
    >
      <img 
        src={src} 
        alt={alt} 
        className="h-10 w-10 md:h-12 md:w-12"
        width={48}
        height={48}
        decoding="async"
        loading="eager"
      />
    </button>
  );
};

export default Logo;
