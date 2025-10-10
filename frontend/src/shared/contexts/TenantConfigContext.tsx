import type { ReactNode } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { useAffiliate } from '../hooks/useAffiliate';
import { TenantConfig } from '../types';
import { affiliateToTenantConfig, tenantConfigToLegacy } from '../utils/tenantConfigMigration';

// Local type for backward compatibility (avoids importing deprecated type)
interface LegacyTenantConfig {
  branding?: {
    businessName?: string;
    logo?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  serviceAreas?: Array<{
    id: number;
    city: string;
    state_code: string;
    postal_codes: string[];
    is_primary: boolean;
  }>;
}

/**
 * Tenant Config Context Type
 * Provides both new (centralized) and legacy formats for backward compatibility
 */
export interface TenantConfigContextType {
  // New centralized format
  tenantConfig: TenantConfig | null;
  
  // Legacy format (for backward compatibility)
  legacyConfig: LegacyTenantConfig | null;
  
  // Status
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshTenantConfig: () => Promise<void>;
}

export const TenantConfigContext = createContext<TenantConfigContextType | null>(null);

interface TenantConfigProviderProps {
  children: ReactNode;
}

/**
 * Tenant Config Provider
 * 
 * Provides tenant configuration in both:
 * - New centralized format (TenantConfig)
 * - Legacy format (LegacyTenantConfig) for backward compatibility
 * 
 * Data source: Affiliate API (useAffiliate hook)
 */
export const TenantConfigProvider: React.FC<TenantConfigProviderProps> = ({ children }) => {
  const [tenantConfigState, setTenantConfigState] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get affiliate data and industry context
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- useAffiliate hook is deprecated but still needed during migration period
  const { affiliate, industry, loading: affiliateLoading, error: affiliateError } = useAffiliate();

  const refreshTenantConfig = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (affiliate && industry) {
        // Convert affiliate data to new centralized format
        const config = affiliateToTenantConfig({
          id: affiliate.id,
          slug: affiliate.slug,
          business_name: affiliate.business_name,
          business_phone: affiliate.business_phone,
          business_email: affiliate.business_email,
          facebook_url: affiliate.facebook_url,
          instagram_url: affiliate.instagram_url,
          tiktok_url: affiliate.tiktok_url,
          youtube_url: affiliate.youtube_url,
          service_areas: affiliate.service_areas,
          industry: industry as string,  // Pass industry for correct logo path, type-checked by truthiness guard above
          logo_url: affiliate.logo_url as string | undefined  // Use affiliate's logo if available
        });
        
        setTenantConfigState(config);
      } else if (affiliateError) {
        setError(typeof affiliateError === 'string' ? affiliateError : 'Failed to load affiliate data');
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

  // Create legacy format for backward compatibility
  const legacyConfig = tenantConfigState ? tenantConfigToLegacy(tenantConfigState) : null;

  const value: TenantConfigContextType = {
    tenantConfig: tenantConfigState,
    legacyConfig,
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
