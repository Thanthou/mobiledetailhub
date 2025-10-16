import { useQuery } from '@tanstack/react-query';

import type { Business } from '../types/business.types';
import { tenantApi } from '../api/tenant.api';

export const useBusiness = (slug: string) => {
  return useQuery({
    queryKey: ['header','business', slug],
    queryFn: () => tenantApi.getTenantBySlug(slug),
    enabled: !!slug, // Only run query if slug exists
    staleTime: 10 * 60 * 1000, // 10 minutes - business data rarely changes
    retry: 2,
  });
};
