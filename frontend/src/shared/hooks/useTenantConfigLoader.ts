/**
 * Tenant Config Loader Hook
 * Centralized, DRY way to fetch and cache tenant configurations
 * 
 * Uses React Query for caching, deduplication, and state management
 * Validates all configs with Zod schemas at the API boundary
 */

import { useParams } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';

import { 
  fetchTenantConfigById,
  fetchTenantConfigBySlug, 
  fetchTenants,
  tenantConfigKeys 
} from '../api/tenantConfig.api';
import type { Vertical } from '../types';

/**
 * Options for tenant config loader
 */
export interface UseTenantConfigLoaderOptions {
  tenantId?: string | number;
  slug?: string;
  vertical?: Vertical;
  enabled?: boolean;  // Conditional fetching
}

/**
 * Load tenant configuration with React Query
 * 
 * Automatically:
 * - Fetches from API
 * - Validates with Zod
 * - Caches with React Query
 * - Deduplicates requests
 * - Handles loading/error states
 * 
 * @param options - Loader options
 * @returns React Query result with typed TenantConfig
 * 
 * @example
 * ```tsx
 * // By slug (from URL params)
 * const { data: config, isLoading } = useTenantConfigLoader();
 * 
 * // By specific slug
 * const { data: config } = useTenantConfigLoader({ slug: 'johns-detailing' });
 * 
 * // By tenant ID
 * const { data: config } = useTenantConfigLoader({ tenantId: 123 });
 * ```
 */
export function useTenantConfigLoader(options: UseTenantConfigLoaderOptions = {}) {
  // Get slug from URL params if not provided
  const params = useParams<{ slug?: string; tenantSlug?: string; businessSlug?: string }>();
  const urlSlug = params.slug || params.tenantSlug || params.businessSlug;
  
  const { 
    tenantId, 
    slug = urlSlug, 
    enabled = true 
  } = options;
  
  // Determine which fetch method to use
  const fetchFn = async () => {
    if (tenantId) {
      return fetchTenantConfigById(tenantId);
    } else if (slug) {
      return fetchTenantConfigBySlug(slug);
    }
    throw new Error('Either tenantId or slug must be provided');
  };
  
  // Generate cache key
  const queryKey = tenantId 
    ? tenantConfigKeys.byId(tenantId)
    : slug 
    ? tenantConfigKeys.bySlug(slug)
    : tenantConfigKeys.all;
  
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    enabled: enabled && (!!tenantId || !!slug),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,     // 10 minutes (cache time)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Load list of tenants (optionally filtered by vertical)
 * 
 * @param vertical - Optional vertical filter
 * @returns React Query result with array of TenantConfig
 * 
 * @example
 * ```tsx
 * // All tenants
 * const { data: tenants } = useTenantsList();
 * 
 * // Only detailing tenants
 * const { data: detailers } = useTenantsList('mobile-detailing');
 * ```
 */
export function useTenantsList(vertical?: Vertical) {
  return useQuery({
    queryKey: tenantConfigKeys.list(vertical),
    queryFn: () => fetchTenants(vertical),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Prefetch a tenant config (for performance optimization)
 * 
 * @param slug - Tenant slug to prefetch
 * 
 * @example
 * ```tsx
 * import { useQueryClient } from '@tanstack/react-query';
 * import { prefetchTenantConfig } from '@/shared/hooks';
 * 
 * function TenantLink({ slug }: { slug: string }) {
 *   const queryClient = useQueryClient();
 *   
 *   return (
 *     <Link 
 *       to={`/${slug}`}
 *       onMouseEnter={() => prefetchTenantConfig(queryClient, slug)}
 *     >
 *       {slug}
 *     </Link>
 *   );
 * }
 * ```
 */
export async function prefetchTenantConfig(
  queryClient: QueryClient,
  slug: string
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: tenantConfigKeys.bySlug(slug),
    queryFn: () => fetchTenantConfigBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });
}

