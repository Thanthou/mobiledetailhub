import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// import { useBusiness } from '../hooks/useBusiness';
import type { Business, BusinessResponse } from '../types/business.types';

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
  
  const result: BusinessResponse = await response.json();
  
  if (!result.success) {
    throw new Error('API returned error');
  }
  
  return result.data;
};

interface DataContextType {
  businessName: string;
  phone: string;
  email: string;
  owner: string;
  location: string;
  serviceAreas: Array<{city: string, state: string, zip?: string, primary?: boolean, minimum?: number, multiplier?: number}>;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  isLoading: boolean;
  isTenant: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

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
  
  const { data: businessData, isLoading } = useQuery({
    queryKey: ['business', slug],
    queryFn: () => fetchBusiness(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
  
  // Always provide tenant data - no defaults needed
  const contextValue: DataContextType = {
    businessName: businessData?.business_name || 'Loading...',
    phone: businessData?.business_phone || '',
    email: businessData?.business_email || 'service@mobiledetailhub.com',
    owner: businessData?.owner || '',
    location: businessData?.service_areas?.[0] ? 
      `${businessData.service_areas[0].city}, ${businessData.service_areas[0].state}` : '',
    serviceAreas: businessData?.service_areas || [],
    socialMedia: {
      facebook: businessData?.facebook_url && businessData.facebook_url !== null && businessData.facebook_url.trim() !== '' ? businessData.facebook_url : undefined,
      instagram: businessData?.instagram_url && businessData.instagram_url !== null && businessData.instagram_url.trim() !== '' ? businessData.instagram_url : undefined,
      youtube: businessData?.youtube_url && businessData.youtube_url !== null && businessData.youtube_url.trim() !== '' ? businessData.youtube_url : undefined,
      tiktok: businessData?.tiktok_url && businessData.tiktok_url !== null && businessData.tiktok_url.trim() !== '' ? businessData.tiktok_url : undefined
    },
    isLoading,
    isTenant: true // Always a tenant page
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
