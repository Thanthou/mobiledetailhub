import { useQuery } from '@tanstack/react-query';

import { tenantApi } from '../api/tenant.api';

export const useTenants = () => {
  return useQuery({
    queryKey: ['header','tenants'],
    queryFn: tenantApi.getTenants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
