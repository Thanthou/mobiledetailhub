/**
 * Data Context
 * 
 * Central data provider for tenant-based applications
 * 
 * Single responsibility: Orchestrate and provide tenant + industry config data
 * Business logic is delegated to hooks, API clients, and utility functions
 */

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchIndustryConfig } from '@/shared/api/industryConfigApi';
import { useTenantData } from '@/shared/hooks/useTenantData';
import { useTenantSlug } from '@/shared/hooks/useTenantSlug';
import type { MainSiteConfig } from '@/shared/types/location';
import {
  getBusinessEmail,
  getPrimaryLocation,
  transformSocialMedia,
  type SocialMediaLinks
} from '@/shared/utils/tenantDataTransform';

/**
 * Data context type definition
 */
interface DataContextType {
  // Tenant data (from API)
  businessName: string;
  phone: string;
  email: string;
  owner: string;
  location: string;
  industry: string;
  serviceAreas: Array<{
    city: string;
    state: string;
    zip?: string;
    primary?: boolean;
    minimum?: number;
    multiplier?: number;
  }>;
  socialMedia: SocialMediaLinks;
  
  // Industry config (from data files)
  siteConfig: MainSiteConfig | null;
  
  // Status flags
  isLoading: boolean;
  isTenant: boolean;
  isPreview?: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

// Export the context so preview pages can inject mock data
export { DataContext };

interface DataProviderProps {
  children: React.ReactNode;
}

/**
 * Data Provider Component
 * 
 * Provides centralized access to tenant and industry configuration data
 * Uses composition of hooks and utilities for clean separation of concerns
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Step 1: Get tenant slug from URL or domain
  const slug = useTenantSlug();
  
  // Step 2: Fetch tenant/business data
  const { data: businessData, isLoading: isLoadingBusiness } = useTenantData({ 
    slug: slug 
  });
  
  // Step 3: Fetch industry config based on tenant's industry
  const industry = businessData?.industry || 'mobile-detailing';
  const { data: siteConfig, isLoading: isLoadingSiteConfig } = useQuery({
    queryKey: ['siteConfig', industry],
    queryFn: () => fetchIndustryConfig(industry),
    enabled: !!businessData?.industry,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
  
  // Step 4: Compute derived state
  const isLoading = isLoadingBusiness || isLoadingSiteConfig;
  
  // Step 5: Transform and assemble context value
  const contextValue: DataContextType = {
    // Tenant data with fallbacks
    businessName: businessData?.business_name || 'Loading...',
    phone: businessData?.business_phone || '',
    email: businessData ? getBusinessEmail(businessData) : 'service@thatsmartsite.com',
    owner: businessData?.owner || '',
    location: businessData ? getPrimaryLocation(businessData) : '',
    industry: businessData?.industry || 'mobile-detailing',
    serviceAreas: businessData?.service_areas || [],
    
    // Social media (filtered and transformed)
    socialMedia: businessData ? transformSocialMedia(businessData) : {},
    
    // Industry config
    siteConfig: siteConfig || null,
    
    // Status
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

/**
 * Hook to access data context
 * Throws error if used outside DataProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { businessName, phone, siteConfig } = useData();
 *   return <div>{businessName}</div>;
 * }
 * ```
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

/**
 * Optional version of useData that returns null if not in a provider
 * Useful for components that may or may not be wrapped in DataProvider
 * 
 * @example
 * ```tsx
 * function OptionalComponent() {
 *   const data = useDataOptional();
 *   if (!data) return <div>No tenant data available</div>;
 *   return <div>{data.businessName}</div>;
 * }
 * ```
 */
export const useDataOptional = (): DataContextType | null => {
  const context = useContext(DataContext);
  return context;
};
