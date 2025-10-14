import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import type { MainSiteConfig } from '@/shared/types/location';
import type { Business, BusinessResponse } from '@/shared/types/tenant-business.types';

// Function to extract tenant from domain/subdomain in production
const getTenantFromDomain = (): string => {
  const hostname = window.location.hostname;
  
  // For subdomain approach: jps.mobiledetailhub.com -> jps
  if (hostname.includes('.')) {
    const subdomain = hostname.split('.')[0];
    if (subdomain !== 'www' && subdomain !== 'mobiledetailhub') {
      return subdomain;
    }
  }
  
  // For custom domain approach: jpsdetailing.com -> jps
  // This would need to be configured based on your domain mapping
  const domainMappings: Record<string, string> = {
    'jpsdetailing.com': 'jps',
    'example.com': 'example',
    // Add more domain mappings as needed
  };
  
  return domainMappings[hostname] || 'jps'; // Default fallback
};

const fetchBusiness = async (slug: string): Promise<Business> => {
  const response = await fetch(`/api/tenants/${slug}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch business data');
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- response.json() returns any
  const result: BusinessResponse = await response.json();
  
  if (!result.success) {
    throw new Error('API returned error');
  }
  
  return result.data;
};

const fetchSiteConfig = async (industry: string): Promise<MainSiteConfig> => {
  // Dynamic import based on industry
  const module = await import(`@/data/${industry}/site.json`) as { default: MainSiteConfig };
  return module.default;
};

interface DataContextType {
  businessName: string;
  phone: string;
  email: string;
  owner: string;
  location: string;
  industry: string;
  serviceAreas: Array<{city: string, state: string, zip?: string, primary?: boolean, minimum?: number, multiplier?: number}>;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  siteConfig: MainSiteConfig | null;
  isLoading: boolean;
  isTenant: boolean;
  isPreview?: boolean; // Flag for preview mode
}

const DataContext = createContext<DataContextType | null>(null);

// Export the context so preview pages can inject mock data
export { DataContext };

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const params = useParams();
  
  // In development, get tenant from URL slug
  // In production, tenant should be determined by domain/subdomain
  const slug = import.meta.env.DEV 
    ? (params.businessSlug || params.tenantSlug || params.slug)
    : getTenantFromDomain(); // This function would need to be implemented
  
  
  // Always fetch business data - we're always on a tenant webpage
  // The slug should always be present since all routes are tenant-based
  
  const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ['business', slug],
    queryFn: () => fetchBusiness(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
  
  // Fetch site.json dynamically based on industry
  const industry = businessData?.industry || 'mobile-detailing';
  const { data: siteConfig, isLoading: isLoadingSiteConfig } = useQuery({
    queryKey: ['siteConfig', industry],
    queryFn: () => fetchSiteConfig(industry),
    enabled: !!businessData?.industry,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
  
  const isLoading = isLoadingBusiness || isLoadingSiteConfig;
  
  // Always provide tenant data - no defaults needed
  const contextValue: DataContextType = {
    businessName: businessData?.business_name || 'Loading...',
    phone: businessData?.business_phone || '',
    email: businessData?.business_email || 'service@mobiledetailhub.com',
    owner: businessData?.owner || '',
    location: businessData?.service_areas?.[0] ? 
      `${businessData.service_areas[0].city}, ${businessData.service_areas[0].state}` : '',
    industry: businessData?.industry || 'mobile-detailing',
    serviceAreas: businessData?.service_areas || [],
    socialMedia: {
      facebook: businessData?.facebook_url && businessData.facebook_url.trim() !== '' ? businessData.facebook_url : undefined,
      instagram: businessData?.instagram_url && businessData.instagram_url.trim() !== '' ? businessData.instagram_url : undefined,
      youtube: businessData?.youtube_url && businessData.youtube_url.trim() !== '' ? businessData.youtube_url : undefined,
      tiktok: businessData?.tiktok_url && businessData.tiktok_url.trim() !== '' ? businessData.tiktok_url : undefined
    },
    siteConfig: siteConfig || null,
    isLoading,
    isTenant: true, // Always a tenant page
    isPreview: false // Regular tenant page, not preview
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- Hook is part of the provider pattern
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Optional version of useData that returns null if not in a provider
// eslint-disable-next-line react-refresh/only-export-components -- Hook is part of the provider pattern
export const useDataOptional = (): DataContextType | null => {
  const context = useContext(DataContext);
  return context;
};

