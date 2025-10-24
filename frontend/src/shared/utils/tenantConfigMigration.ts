/**
 * Tenant Config Migration Utilities
 * Helpers for converting between old (simple) and new (centralized) tenant config formats
 */

import { TenantConfig, Vertical } from '@shared/types';

import { getTenantAssetUrl } from './assetLocator';

/**
 * Type guard to check if a string is a valid Vertical
 */
function isValidVertical(value: unknown): value is Vertical {
  return typeof value === 'string' && [
    'mobile-detailing',
    'pet-grooming',
    'lawn-care',
    'house-cleaning',
    'hvac',
    'plumbing',
    'electrical'
  ].includes(value);
}

/**
 * Old tenant config format (10 simple fields)
 * @deprecated Use TenantConfig from @/shared/types instead
 */
export interface LegacyTenantConfig {
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

/**
 * Convert legacy tenant config to new centralized format
 * 
 * @param legacy - Old format config
 * @param affiliateId - Affiliate/tenant ID (optional, will generate from business_name if not provided)
 * @returns New centralized TenantConfig
 */
export function legacyToTenantConfig(
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- This function intentionally works with legacy format for migration
  legacy: LegacyTenantConfig,
  affiliateId?: string | number
): TenantConfig {
  // Generate slug from business name if not provided
  const slug = affiliateId 
    ? String(affiliateId) 
    : legacy.business_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
  
  return {
    // Core identity
    id: affiliateId || slug,
    slug: slug,
    vertical: 'mobile-detailing',  // Default to mobile-detailing
    status: 'active',
    
    // Branding
    branding: {
      businessName: legacy.business_name,
      logo: {
        url: legacy.logo_url
      }
    },
    
    // Contact
    contact: {
      phones: {
        main: legacy.phone
      },
      emails: {
        primary: legacy.email
      },
      socials: {
        facebook: legacy.facebook,
        instagram: legacy.instagram,
        tiktok: legacy.tiktok,
        youtube: legacy.youtube
      },
      baseLocation: {
        city: legacy.base_location.city,
        state: legacy.base_location.state
      }
    }
  };
}

/**
 * Convert new centralized config to legacy format (for backward compatibility)
 * 
 * @param config - New centralized TenantConfig
 * @returns Old format config
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated -- This function intentionally returns legacy format for backward compatibility
export function tenantConfigToLegacy(config: TenantConfig): LegacyTenantConfig {
  return {
    business_name: config.branding.businessName,
    phone: config.contact.phones.main,
    email: config.contact.emails.primary,
    logo_url: config.branding.logo.url,
    facebook: config.contact.socials.facebook,
    instagram: config.contact.socials.instagram,
    tiktok: config.contact.socials.tiktok,
    youtube: config.contact.socials.youtube,
    base_location: {
      city: config.contact.baseLocation.city,
      state: config.contact.baseLocation.state
    }
  };
}

/**
 * Create a minimal tenant config from affiliate API data
 * 
 * @param affiliate - Affiliate data from API
 * @returns Minimal TenantConfig
 */
export function affiliateToTenantConfig(affiliate: {
  id?: string | number;
  slug?: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  service_areas?: Array<{ city: string; state: string; primary?: boolean }>;
  industry?: string;
  logo_url?: string;
}): TenantConfig {
  // Find primary service area or use first one
  const primaryArea = affiliate.service_areas?.find(area => area.primary) || affiliate.service_areas?.[0];
  
  // Safely convert industry to Vertical type
  const vertical: Vertical = isValidVertical(affiliate.industry) 
    ? affiliate.industry 
    : 'mobile-detailing';
  
  // Build logo URL - use affiliate's logo if provided, otherwise use industry default
  // Only check tenant uploads if a custom logo_url exists in the database
  const logoUrl = affiliate.logo_url || getTenantAssetUrl({
    vertical: vertical,
    type: 'logo',
    forceVerticalDefault: true, // Always use industry default if no custom logo
  });
  
  return {
    // Core identity
    id: affiliate.id || affiliate.slug || 'unknown',
    slug: affiliate.slug || affiliate.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    vertical,
    status: 'active',
    
    // Branding
    branding: {
      businessName: affiliate.business_name,
      logo: {
        url: logoUrl
      }
    },
    
    // Contact
    contact: {
      phones: {
        main: affiliate.business_phone
      },
      emails: {
        primary: affiliate.business_email
      },
      socials: {
        facebook: affiliate.facebook_url || '',
        instagram: affiliate.instagram_url || '',
        tiktok: affiliate.tiktok_url || '',
        youtube: affiliate.youtube_url || ''
      },
      baseLocation: {
        city: primaryArea?.city || 'Unknown',
        state: primaryArea?.state || 'Unknown'
      }
    }
  };
}

