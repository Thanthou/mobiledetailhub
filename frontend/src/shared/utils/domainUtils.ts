/**
 * Domain Resolution Utilities
 * 
 * Single responsibility: Extract tenant slug from hostname/domain
 * Pure functions with no side effects
 */

/**
 * Domain-to-tenant slug mappings for custom domains
 * In production, this could be loaded from a config file or API
 */
const CUSTOM_DOMAIN_MAPPINGS: Record<string, string> = {
  'jpsdetailing.com': 'jps',
  'example.com': 'example',
  'thatsmartsite.com': 'main-site', // Main site for admin dashboard
  'thatsmartsite-backend.onrender.com': 'main-site', // Render URL for admin dashboard
  // Add more domain mappings as needed
};

/**
 * Reserved subdomains that should not be treated as tenant slugs
 */
const RESERVED_SUBDOMAINS = ['www', 'thatsmartsite', 'api', 'admin', 'staging', 'dev', 'main-site'];

/**
 * Extract tenant slug from subdomain
 * Example: jps.thatsmartsite.com -> 'jps'
 * 
 * @param hostname - The hostname to parse
 * @returns Tenant slug or null if not a valid subdomain
 */
function getTenantFromSubdomain(hostname: string): string | null {
  if (!hostname.includes('.')) {
    return null;
  }
  
  const parts = hostname.split('.');
  const subdomain = parts[0];
  
  // Check if subdomain is reserved
  if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain)) {
    return null;
  }
  
  return subdomain;
}

/**
 * Extract tenant slug from custom domain mapping
 * Example: jpsdetailing.com -> 'jps'
 * 
 * @param hostname - The hostname to look up
 * @returns Tenant slug or null if not in mapping
 */
function getTenantFromCustomDomain(hostname: string): string | null {
  return CUSTOM_DOMAIN_MAPPINGS[hostname] || null;
}

/**
 * Extract tenant slug from domain/subdomain in production
 * Tries subdomain approach first, then custom domain mapping
 * 
 * @param hostname - Optional hostname to parse (defaults to window.location.hostname)
 * @param defaultSlug - Default slug to return if no tenant found (defaults to 'jps')
 * @returns Tenant slug
 * 
 * @example
 * ```ts
 * // Subdomain: jps.thatsmartsite.com -> 'jps'
 * const slug = getTenantFromDomain();
 * 
 * // Custom domain: jpsdetailing.com -> 'jps'
 * const slug = getTenantFromDomain('jpsdetailing.com');
 * 
 * // No match: example.org -> 'default-tenant'
 * const slug = getTenantFromDomain('example.org', 'default-tenant');
 * ```
 */
export function getTenantFromDomain(
  hostname: string = window.location.hostname,
  defaultSlug: string = 'main-site'
): string {
  // Try subdomain approach first
  const subdomainSlug = getTenantFromSubdomain(hostname);
  if (subdomainSlug) {
    return subdomainSlug;
  }
  
  // Try custom domain mapping
  const customDomainSlug = getTenantFromCustomDomain(hostname);
  if (customDomainSlug) {
    return customDomainSlug;
  }
  
  // Return default fallback
  return defaultSlug;
}

/**
 * Add a custom domain mapping at runtime
 * Useful for dynamic tenant configurations
 * 
 * @param domain - Custom domain
 * @param slug - Tenant slug to map to
 * 
 * @example
 * ```ts
 * addDomainMapping('newclient.com', 'newclient-slug');
 * ```
 */
export function addDomainMapping(domain: string, slug: string): void {
  CUSTOM_DOMAIN_MAPPINGS[domain] = slug;
}

/**
 * Get all custom domain mappings
 * Useful for debugging or admin panels
 */
export function getDomainMappings(): Record<string, string> {
  return { ...CUSTOM_DOMAIN_MAPPINGS };
}

/**
 * Check if a hostname is a reserved subdomain
 * 
 * @param hostname - The hostname to check
 * @returns True if the subdomain is reserved
 */
export function isReservedSubdomain(hostname: string): boolean {
  const parts = hostname.split('.');
  const subdomain = parts[0];
  
  if (!subdomain) {
    return false;
  }
  
  return RESERVED_SUBDOMAINS.includes(subdomain);
}

