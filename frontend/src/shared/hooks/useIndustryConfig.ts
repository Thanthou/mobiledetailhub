/**
 * Industry Configuration Hook
 * Centralized loader for industry-specific site configs from /data/{industry}/site.json
 * 
 * Usage:
 *   const { siteConfig, isLoading } = useIndustryConfig('mobile-detailing');
 *   console.log(siteConfig.hero.h1);
 * 
 * This hook is for direct industry config access. Most components should use
 * the DataContext (via useData) which automatically loads both tenant + industry config.
 */

import { useQuery } from '@tanstack/react-query';

import type { MainSiteConfig } from '@/shared/types/location';

/**
 * Load industry site configuration from /data/{industry}/site.json
 */
async function fetchIndustryConfig(industry: string): Promise<MainSiteConfig> {
  try {
    // Dynamic import based on industry
    const module = await import(`@/data/${industry}/site.json`) as { default: MainSiteConfig };
    return module.default;
  } catch (error) {
    console.error(`Failed to load site config for industry: ${industry}`, error);
    throw new Error(`Industry config not found: ${industry}`);
  }
}

/**
 * Hook to access industry-specific site configuration
 * 
 * @param industry - Industry identifier (e.g., 'mobile-detailing', 'maid-service', 'pet-grooming')
 * @param options - React Query options
 * @returns Site config with loading/error states
 * 
 * @example
 * ```tsx
 * // Direct usage
 * const { siteConfig, isLoading } = useIndustryConfig('mobile-detailing');
 * 
 * // With tenant data
 * const tenantData = useData(); // From DataContext
 * const { siteConfig } = useIndustryConfig(tenantData.industry);
 * ```
 */
export function useIndustryConfig(
  industry: string | null | undefined,
  options?: {
    enabled?: boolean;
  }
) {
  const { data: siteConfig, isLoading, error } = useQuery({
    queryKey: ['industryConfig', industry],
    queryFn: () => fetchIndustryConfig(industry!),
    enabled: options?.enabled !== false && !!industry,
    staleTime: 10 * 60 * 1000, // 10 minutes - configs rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
  });
  
  return {
    siteConfig: siteConfig || null,
    isLoading,
    error: error as Error | null,
    industry: industry || null,
  };
}

/**
 * Prefetch industry config for performance optimization
 * Useful for hover states or route prefetching
 * 
 * @example
 * ```tsx
 * import { useQueryClient } from '@tanstack/react-query';
 * import { prefetchIndustryConfig } from '@/shared/hooks';
 * 
 * function IndustryLink({ industry }: { industry: string }) {
 *   const queryClient = useQueryClient();
 *   
 *   return (
 *     <Link 
 *       to={`/${industry}`}
 *       onMouseEnter={() => prefetchIndustryConfig(queryClient, industry)}
 *     >
 *       {industry}
 *     </Link>
 *   );
 * }
 * ```
 */
export async function prefetchIndustryConfig(
  queryClient: any,
  industry: string
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: ['industryConfig', industry],
    queryFn: () => fetchIndustryConfig(industry),
    staleTime: 10 * 60 * 1000,
  });
}

