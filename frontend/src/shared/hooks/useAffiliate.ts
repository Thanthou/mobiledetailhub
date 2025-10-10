/**
 * React hook for managing affiliate data with industry context
 * 
 * @deprecated This hook is LEGACY and should not be used in new code
 * Use useTenantConfig() from '@/shared/hooks' instead
 * 
 * Migration:
 * - Old: const { affiliate, industry } = useAffiliate();
 * - New: const { tenantConfig, vertical } = useTenantConfig();
 * 
 * This hook is only used internally by TenantConfigContext
 * Direct usage in features is deprecated
 */

import { useCallback,useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchAffiliateBySlug } from '../api/affiliateApi';
import { Affiliate, IndustryType } from '../types/affiliate.types';

export interface UseAffiliateReturn {
  affiliate: Affiliate | null;
  industry: IndustryType | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage affiliate data based on URL slug
 * 
 * @deprecated Use useTenantConfig() instead
 * This is now only used internally by TenantConfigContext
 */
export function useAffiliate(): UseAffiliateReturn {
  const { slug } = useParams<{ slug: string }>();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [industry, setIndustry] = useState<IndustryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliate = useCallback(async () => {
    if (!slug) {
      setAffiliate(null);
      setIndustry(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchAffiliateBySlug(slug);
      
      if (result.success && result.data) {
        setAffiliate(result.data);
        setIndustry(result.data.industry);
      } else {
        setError(result.error || 'Failed to fetch affiliate data');
        setAffiliate(null);
        setIndustry(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setAffiliate(null);
      setIndustry(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchAffiliate();
  }, [fetchAffiliate]);

  return {
    affiliate,
    industry,
    loading,
    error,
    refetch: fetchAffiliate,
  };
}

/**
 * Hook to get industry context from affiliate data
 */
export function useIndustryContext(): {
  industry: IndustryType | null;
  isMobileDetailing: boolean;
  isPetGrooming: boolean;
  isLawncare: boolean;
  isMaidService: boolean;
} {
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- This hook is also deprecated and internally uses deprecated useAffiliate
  const { industry } = useAffiliate();

  return {
    industry,
    isMobileDetailing: industry === 'mobile-detailing',
    isPetGrooming: industry === 'pet-grooming',
    isLawncare: industry === 'lawncare',
    isMaidService: industry === 'maid-service',
  };
}
