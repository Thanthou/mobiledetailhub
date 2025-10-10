import { useContext } from 'react';

import { TenantConfigContext } from '@/shared/contexts/TenantConfigContext';

/**
 * Hook to access tenant configuration
 * 
 * Provides:
 * - tenantConfig: New centralized format (recommended)
 * - legacyConfig: Old format (for backward compatibility)
 * - Helper methods for common access patterns
 * 
 * @example
 * ```tsx
 * const { tenantConfig, businessName, phone } = useTenantConfig();
 * 
 * // New way (recommended)
 * <h1>{tenantConfig?.branding.businessName}</h1>
 * 
 * // Or use helpers
 * <h1>{businessName}</h1>
 * <a href={`tel:${phone}`}>{phone}</a>
 * ```
 */
export const useTenantConfig = () => {
  const context = useContext(TenantConfigContext);

  // During hot module reload (HMR), the context might temporarily be unavailable
  // Return a safe default instead of throwing to prevent crashes during development
  if (!context) {
    // In production, this should never happen as the provider is always present
    // In development, it can happen during HMR, so we provide safe defaults
    if (import.meta.env.PROD) {
      throw new Error('useTenantConfig must be used within a TenantConfigProvider');
    }
    
    // Return safe defaults for development/HMR
    console.warn('useTenantConfig: Context not available (likely during HMR refresh)');
    return {
      tenantConfig: null,
      legacyConfig: null,
      isLoading: true,
      error: null,
      refreshTenantConfig: async () => Promise.resolve(),
      // Helper getters with null values
      businessName: undefined,
      logoUrl: undefined,
      tagline: undefined,
      phone: undefined,
      email: undefined,
      facebook: undefined,
      instagram: undefined,
      tiktok: undefined,
      youtube: undefined,
      city: undefined,
      state: undefined,
      slug: undefined,
      vertical: undefined,
      status: undefined,
    };
  }

  // Helper getters for common access patterns
  const helpers = {
    // Business info
    businessName: context.tenantConfig?.branding.businessName,
    logoUrl: context.tenantConfig?.branding.logo.url,
    tagline: context.tenantConfig?.branding.tagline,
    
    // Contact
    phone: context.tenantConfig?.contact.phones.main,
    email: context.tenantConfig?.contact.emails.primary,
    
    // Social media
    facebook: context.tenantConfig?.contact.socials.facebook,
    instagram: context.tenantConfig?.contact.socials.instagram,
    tiktok: context.tenantConfig?.contact.socials.tiktok,
    youtube: context.tenantConfig?.contact.socials.youtube,
    
    // Location
    city: context.tenantConfig?.contact.baseLocation.city,
    state: context.tenantConfig?.contact.baseLocation.state,
    
    // Status
    slug: context.tenantConfig?.slug,
    vertical: context.tenantConfig?.vertical,
    status: context.tenantConfig?.status,
  };

  return {
    ...context,
    ...helpers,
  };
};
