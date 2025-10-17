/**
 * Tenant Utility Functions
 * 
 * Helper functions for tenant-related operations
 */

/**
 * Check if a tenant slug is a dummy/test tenant
 * @param {string} tenantSlug - The tenant slug to check
 * @returns {boolean} True if this is a dummy tenant
 */
export function isDummyTenant(tenantSlug) {
  if (!tenantSlug) return false;
  
  const dummyTenants = [
    'demo-tenant',
    'brandan-test', 
    'test-tenant',
    'mock-tenant',
    'preview-tenant',
    'testing-mobile-detail'
  ];
  
  return dummyTenants.includes(tenantSlug.toLowerCase());
}

/**
 * Get list of dummy tenant slugs
 * @returns {string[]} Array of dummy tenant slugs
 */
export function getDummyTenantSlugs() {
  return [
    'demo-tenant',
    'brandan-test', 
    'test-tenant',
    'mock-tenant',
    'preview-tenant',
    'testing-mobile-detail'
  ];
}

/**
 * Validate tenant slug format
 * @param {string} tenantSlug - The tenant slug to validate
 * @returns {boolean} True if valid format
 */
export function isValidTenantSlug(tenantSlug) {
  if (!tenantSlug || typeof tenantSlug !== 'string') return false;
  
  // Allow alphanumeric, hyphens, and underscores
  // Length between 3-50 characters
  const slugRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return slugRegex.test(tenantSlug);
}
