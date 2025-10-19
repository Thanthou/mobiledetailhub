/**
 * Unified Tenant Context
 * 
 * Provides consistent tenant context across all applications.
 * Replaces multiple tenant context implementations with a single source of truth.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchBusinessBySlug } from '@/shared/api/tenantApi';
import { useTenantSlug } from '@/shared/hooks/useTenantSlug';
import type { 
  TenantInfo, 
  TenantContextProviderProps, 
  UseTenantContextReturn,
  TenantValidationResult 
} from '@/shared/types/tenant.types';

/**
 * Tenant context type definition
 */
export interface TenantContextType {
  // Core tenant data
  tenant: TenantInfo | null;
  
  // Loading and error states
  loading: boolean;
  error: Error | null;
  
  // Utility functions
  refetch: () => void;
  isValid: boolean;
  
  // Validation helpers
  validateTenant: () => TenantValidationResult;
  
  // Quick access properties
  tenantId: string | null;
  tenantSlug: string | null;
  isMainSite: boolean;
}

/**
 * Create the tenant context
 */
const TenantContext = createContext<TenantContextType | null>(null);

/**
 * Transform business data from API to TenantInfo format
 */
function transformBusinessToTenantInfo(business: any): TenantInfo {
  return {
    id: business.id.toString(),
    slug: business.slug,
    schema: 'tenants', // Default schema name
    domain: `${business.slug}.thatsmartsite.com`, // Constructed domain
    businessName: business.business_name,
    owner: business.owner,
    businessEmail: business.business_email,
    personalEmail: business.personal_email,
    businessPhone: business.business_phone,
    personalPhone: business.personal_phone,
    industry: business.industry,
    applicationStatus: business.application_status,
    businessStartDate: business.business_start_date,
    website: business.website,
    
    socialMedia: {
      facebook: business.facebook_url,
      instagram: business.instagram_url,
      tiktok: business.tiktok_url,
      youtube: business.youtube_url,
      googleBusiness: business.gbp_url,
    },
    
    serviceAreas: business.service_areas || [],
    
    createdAt: business.created_at,
    updatedAt: business.updated_at,
    lastActivity: business.last_activity,
  };
}

/**
 * Unified Tenant Context Provider
 * 
 * Provides tenant context with consistent data structure across all apps.
 * Handles tenant resolution, validation, and error states.
 */
export const UnifiedTenantProvider: React.FC<TenantContextProviderProps> = ({ 
  children, 
  tenant: providedTenant,
  loading: providedLoading = false,
  error: providedError = null 
}) => {
  const tenantSlug = useTenantSlug();
  const [tenant, setTenant] = useState<TenantInfo | null>(providedTenant || null);
  
  // Fetch tenant data if not provided
  const { 
    data: businessData, 
    isLoading: isFetching, 
    error: fetchError,
    refetch 
  } = useQuery({
    queryKey: ['shared', 'tenant', tenantSlug],
    queryFn: () => {
      if (!tenantSlug || tenantSlug === 'main-site') {
        return null; // No tenant data needed for main site
      }
      return fetchBusinessBySlug(tenantSlug);
    },
    enabled: !providedTenant && !!tenantSlug && tenantSlug !== 'main-site',
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
  
  // Transform and set tenant data
  useEffect(() => {
    if (providedTenant) {
      setTenant(providedTenant);
    } else if (businessData) {
      setTenant(transformBusinessToTenantInfo(businessData));
    } else if (tenantSlug === 'main-site') {
      // Main site doesn't need tenant context
      setTenant(null);
    }
  }, [providedTenant, businessData, tenantSlug]);
  
  // Determine loading state
  const loading = providedLoading || isFetching;
  
  // Determine error state
  const error = providedError || fetchError;
  
  // Validation function
  const validateTenant = (): TenantValidationResult => {
    if (!tenant) {
      return {
        isValid: false,
        error: {
          code: 'NO_TENANT_CONTEXT',
          message: 'No tenant context available',
          statusCode: 404,
        },
      };
    }
    
    if (tenant.applicationStatus !== 'approved') {
      return {
        isValid: false,
        error: {
          code: 'TENANT_NOT_APPROVED',
          message: 'Tenant is not approved',
          statusCode: 403,
        },
      };
    }
    
    return {
      isValid: true,
      tenant,
    };
  };
  
  // Context value
  const contextValue: TenantContextType = {
    tenant,
    loading,
    error: error as Error | null,
    refetch: () => {
      void refetch();
    },
    isValid: validateTenant().isValid,
    validateTenant,
    
    // Quick access properties
    tenantId: tenant?.id || null,
    tenantSlug: tenant?.slug || null,
    isMainSite: tenantSlug === 'main-site',
  };
  
  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

/**
 * Hook to use tenant context
 */
export const useTenantContext = (): TenantContextType => {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenantContext must be used within a UnifiedTenantProvider');
  }
  
  return context;
};

/**
 * Hook for backward compatibility with existing useTenant hook
 * @deprecated Use useTenantContext instead
 */
export const useTenant = (): { slug: string | null } => {
  const { tenantSlug } = useTenantContext();
  return { slug: tenantSlug };
};

/**
 * Hook to get tenant validation status
 */
export const useTenantValidation = (): TenantValidationResult => {
  const { validateTenant } = useTenantContext();
  return validateTenant();
};

/**
 * Hook to check if current context is a valid tenant
 */
export const useIsValidTenant = (): boolean => {
  const { isValid } = useTenantContext();
  return isValid;
};
