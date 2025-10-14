import type { ReactNode } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchTenantBySlug } from '../api/tenantApi';
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
 * Data source: Tenant API (fetchTenantBySlug)
 */
export const TenantConfigProvider: React.FC<TenantConfigProviderProps> = ({ children }) => {
  const [tenantConfigState, setTenantConfigState] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug: string }>();

  // Skip fetching for non-tenant routes (admin, onboarding, login, etc.)
  const currentPath = window.location.pathname;
  const isNonTenantRoute = 
    currentPath.startsWith('/admin-dashboard') ||
    currentPath.startsWith('/tenant-dashboard') ||
    currentPath.startsWith('/tenant-onboarding') ||
    currentPath.startsWith('/login') ||
    currentPath.startsWith('/booking') ||
    currentPath.startsWith('/preview-generator') ||
    currentPath.startsWith('/preview');

  const refreshTenantConfig = useCallback(async () => {
    // Skip if no slug or on non-tenant route
    if (!slug || isNonTenantRoute) {
      setTenantConfigState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchTenantBySlug(slug);
      
      if (result.success && result.data) {
        // Convert tenant data to new centralized format
        const config = affiliateToTenantConfig({
          id: result.data.id,
          slug: result.data.slug,
          business_name: result.data.business_name,
          business_phone: result.data.business_phone,
          business_email: result.data.business_email,
          facebook_url: result.data.facebook_url,
          instagram_url: result.data.instagram_url,
          tiktok_url: result.data.tiktok_url,
          youtube_url: result.data.youtube_url,
          service_areas: result.data.service_areas,
          industry: result.data.industry,
          logo_url: result.data.logo_url
        });
        
        setTenantConfigState(config);
      } else {
        setError(result.error || 'Failed to load tenant data');
        setTenantConfigState(null);
      }
    } catch (err) {
      console.error('Error refreshing tenant config:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh tenant config');
      setTenantConfigState(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug, isNonTenantRoute]);

  useEffect(() => {
    void refreshTenantConfig();
  }, [refreshTenantConfig]);

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
