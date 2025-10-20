/**
 * Tenant Data Hook
 * 
 * Single responsibility: Fetch and cache tenant/business data
 * Wraps React Query with proper query keys and options
 */

import { useQuery } from '@tanstack/react-query';

import { fetchBusinessBySlug } from '@shared/api/tenantApi';
import type { Business } from '@shared/types/tenant-business.types';

interface UseTenantDataOptions {
  /**
   * Tenant slug to fetch data for
   */
  slug: string | undefined;
  
  /**
   * Enable/disable the query
   * @default true if slug is provided
   */
  enabled?: boolean;
  
  /**
   * Stale time in milliseconds
   * @default 10 minutes
   */
  staleTime?: number;
  
  /**
   * Number of retry attempts
   * @default 2
   */
  retry?: number;
}

interface UseTenantDataReturn {
  /**
   * Business data from API
   */
  data: Business | undefined;
  
  /**
   * Loading state
   */
  isLoading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Refetch function
   */
  refetch: () => void;
}

/**
 * Fetch tenant/business data by slug with React Query caching
 * 
 * @param options - Query options
 * @returns Business data with loading/error states
 * 
 * @example
 * ```tsx
 * function TenantInfo() {
 *   const { data: business, isLoading } = useTenantData({ slug: 'jps' });
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return <div>{business?.business_name}</div>;
 * }
 * ```
 */
export function useTenantData(options: UseTenantDataOptions): UseTenantDataReturn {
  const {
    slug,
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
    retry = 2
  } = options;
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shared','business', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('Slug is required to fetch business data');
      }
      return fetchBusinessBySlug(slug);
    },
    enabled: enabled && !!slug,
    staleTime,
    retry
  });
  
  return {
    data,
    isLoading,
    error: error || null,
    refetch: () => {
      void refetch();
    }
  };
}

