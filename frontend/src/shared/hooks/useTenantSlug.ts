/**
 * Tenant Slug Hook
 * 
 * Single responsibility: Resolve tenant slug from URL params or domain
 * Encapsulates routing logic and domain resolution
 */

import { useParams } from 'react-router-dom';

import { env } from '@/shared/env';
import { getTenantFromDomain } from '@/shared/utils/domainUtils';

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
 * }
 * ```
 */
export function useTenantSlug(): string | undefined {
  const params = useParams();
  
  // In development, get tenant from URL slug parameter
  // Check multiple param names for flexibility across different routes
  if (env.DEV) {
    return params['businessSlug'] || params['tenantSlug'] || params['slug'];
  }
  
  // In production, tenant is determined by domain/subdomain
  return getTenantFromDomain();
}

