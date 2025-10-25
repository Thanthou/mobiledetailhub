/**
 * Dashboard Tab Configuration
 * Controls which tabs are visible for tenants
 * Can be customized per tenant or globally
 */

export interface TabConfig {
  schedule: boolean;
  customers: boolean;
  services: boolean;
  locations: boolean;
  profile: boolean;
  website: boolean;
}

// Default configuration - can be overridden per tenant
export const DEFAULT_TAB_CONFIG: TabConfig = {
  schedule: false,
  customers: false,
  services: false,
  locations: false, // Disabled - uses Google Maps (not needed currently)
  profile: true,
  website: true,
};

// Tenant-specific configurations (optional)
// This allows for per-tenant customization
export const TENANT_TAB_CONFIGS: Record<string, Partial<TabConfig>> = {
  // Example configurations:
  // 'jps': { schedule: true, customers: true },
  // 'premium-tenant': { schedule: true, customers: true, services: true },
  // 'basic-tenant': { schedule: false, customers: false, services: false },
  
  // Current configuration for 'jps' tenant (as requested):
  'jps': {
    schedule: false,
    customers: false,
    services: false,
    locations: false, // Disabled - uses Google Maps (not needed currently)
    profile: true,
    website: true,
  },
};

/**
 * Get tab configuration for a specific tenant
 * Falls back to default config if no tenant-specific config exists
 */
export const getTabConfig = (tenantSlug?: string): TabConfig => {
  if (!tenantSlug) {
    return DEFAULT_TAB_CONFIG;
  }
  
  const tenantConfig = TENANT_TAB_CONFIGS[tenantSlug];
  if (!tenantConfig) {
    return DEFAULT_TAB_CONFIG;
  }
  
  // Merge tenant config with default config
  return {
    ...DEFAULT_TAB_CONFIG,
    ...tenantConfig,
  };
};
