import { useCallback, useEffect } from 'react';

import { useData, useTenantConfigLoader } from '@/shared/hooks';

/**
 * Hook to handle tenant data and business context
 * Separates tenant logic from form logic
 */
export const useQuoteTenantData = (updateFormData: (field: string, value: string) => void) => {
  const { businessName } = useData();
  const { data: tenantConfig } = useTenantConfigLoader();
  const slug = tenantConfig?.slug;

  // Get business location from tenant config
  const businessLocation = tenantConfig 
    ? `${tenantConfig.contact.baseLocation.city}, ${tenantConfig.contact.baseLocation.state}`
    : '';

  // Get service areas from tenant config (if available)
  const serviceAreas = useCallback((): Array<{ city: string; state: string; primary?: boolean }> => {
    // For now, return empty - service areas will be added to tenant config later
    // When ready, will use: tenantConfig?.serviceAreas
    return [];
  }, []);

  // Set initial location if available
  useEffect(() => {
    if (businessLocation && tenantConfig) {
      // Use tenant location data
      updateFormData('city', tenantConfig.contact.baseLocation.city);
      updateFormData('state', tenantConfig.contact.baseLocation.state);
    }
  }, [businessLocation, tenantConfig, updateFormData]);

  return {
    businessName,
    slug,
    businessLocation,
    serviceAreas
  };
};
