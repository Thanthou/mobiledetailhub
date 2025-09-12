// Type definitions for affiliate FAQ configuration
export interface BusinessConfig {
  city?: string;
  locality?: string;
  state?: string;
  region?: string;
  zip?: string;
  postalCode?: string;
  address?: string;
}

export interface AffiliateConfig {
  business?: BusinessConfig;
  serviceLocations?: string[];
}
