/**
 * Tenant Slug Hook
 * 
 * Single responsibility: Resolve tenant slug from URL params or domain
 * Encapsulates routing logic and domain resolution
 * 
 * IMPORTANT: Returns undefined in preview mode to prevent live data fetching
 */

import { useParams } from 'react-router-dom';

import { env } from '@shared/env';
import { getTenantFromDomain } from '@shared/utils/domainUtils';
import { inPreviewMode } from '@shared/utils';

/**
 * Get tenant slug from URL params (dev) or domain (production)
 * 
 * @returns Tenant slug string or undefined
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const slug = useTenantSlug();
 *   // In dev: slug from URL params (/jps -> 'jps')
 *   // In prod: slug from domain (jps.example.com -> 'jps')
 *   // In preview: undefined (no tenant slug in preview mode)
 * }
 * ```
 * 
 * @note
 * This hook returns undefined in preview mode (e.g., /mobile-detailing-preview).
 * Preview pages should NOT use this hook - they get data from PreviewDataProvider instead.
 */
export function useTenantSlug(): string | undefined {
  const params = useParams();
  
  // CRITICAL: Return undefined in preview mode
  // Preview routes have no tenant slug and should never fetch tenant data
  if (inPreviewMode()) {
    return undefined;
  }
  
  // First, try to get tenant from domain/subdomain (works in both dev and prod)
  const domainSlug = getTenantFromDomain();
  
  if (domainSlug && domainSlug !== 'main-site') {
    return domainSlug;
  }
  
  // Fallback: In development, get tenant from URL slug parameter
  // Check multiple param names for flexibility across different routes
  if (env.DEV) {
    return params['businessSlug'] || params['tenantSlug'] || params['slug'];
  }
  
  // No tenant found
  return undefined;
}

