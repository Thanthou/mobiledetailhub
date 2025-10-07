import type { ReactNode } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAffiliate } from '../hooks/useAffiliate';
import { IndustryType } from '../types/affiliate.types';

// Create a simple interface that matches what components expect
interface TenantConfig {
  business_name: string;
  phone: string;
  email: string;
  logo_url: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  base_location: {
    city: string;
    state: string;
  };
}

// TODO: Load tenant data from database API instead of site.json
// This should be replaced with actual tenant data loading
const tenantConfig: TenantConfig | null = null;

export interface TenantConfigContextType {
  tenantConfig: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshTenantConfig: () => Promise<void>;
}

export const TenantConfigContext = createContext<TenantConfigContextType | null>(null);

interface TenantConfigProviderProps {
  children: ReactNode;
}

export const TenantConfigProvider: React.FC<TenantConfigProviderProps> = ({ children }) => {
  const [tenantConfigState, setTenantConfigState] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get affiliate data and industry context
  const { affiliate, industry, loading: affiliateLoading, error: affiliateError } = useAffiliate();

  const refreshTenantConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (affiliate && industry) {
        // Create tenant config from affiliate data
        const config: TenantConfig = {
          business_name: affiliate.business_name,
          phone: affiliate.business_phone,
          email: affiliate.business_email,
          logo_url: '/icons/logo.webp', // Default logo, can be overridden
          facebook: affiliate.facebook_url || '',
          instagram: affiliate.instagram_url || '',
          tiktok: affiliate.tiktok_url || '',
          youtube: affiliate.youtube_url || '',
          base_location: {
            city: affiliate.service_areas.find(area => area.primary)?.city || 'Unknown',
            state: affiliate.service_areas.find(area => area.primary)?.state || 'Unknown',
          }
        };
        
        setTenantConfigState(config);
      } else if (affiliateError) {
        setError(affiliateError);
      } else {
        // No affiliate data available (main site or loading)
        setTenantConfigState(null);
      }
    } catch (err) {
      console.error('Error refreshing tenant config:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh tenant config');
    } finally {
      setIsLoading(false);
    }
  }, [affiliate, industry, affiliateError]);

  useEffect(() => {
    // Load tenant data when affiliate data changes
    refreshTenantConfig();
  }, [refreshTenantConfig]);

  // Update loading state based on affiliate loading
  useEffect(() => {
    if (affiliateLoading) {
      setIsLoading(true);
    }
  }, [affiliateLoading]);

  const value: TenantConfigContextType = {
    tenantConfig: tenantConfigState,
    isLoading,
    error,
    refreshTenantConfig,
  };

  return (
    <TenantConfigContext.Provider value={value}>
      {children}
    </TenantConfigContext.Provider>
  );
};
