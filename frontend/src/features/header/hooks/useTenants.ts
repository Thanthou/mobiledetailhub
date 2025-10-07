import { useQuery } from '@tanstack/react-query';

export interface Tenant {
  slug: string;
  name: string;
  website: string;
}

interface TenantsResponse {
  success: boolean;
  data: Tenant[];
  count: number;
}

const fetchTenants = async (): Promise<Tenant[]> => {
  const response = await fetch('/api/tenants');
  
  if (!response.ok) {
    throw new Error('Failed to fetch tenants');
  }
  
  const result: TenantsResponse = await response.json();
  
  if (!result.success) {
    throw new Error('API returned error');
  }
  
  return result.data;
};

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
