import { useQuery } from '@tanstack/react-query';

import { tenantApi } from '../api/tenant.api';
// import type { Business } from '../types/business.types';

export const useBusiness = (slug: string) => {
  return useQuery({
    queryKey: ['header','business', slug],
    queryFn: () => tenantApi.getTenantBySlug(slug),
    enabled: !!slug, // Only run query if slug exists
    staleTime: 10 * 60 * 1000, // 10 minutes - business data rarely changes
    retry: 2,
  });
};
