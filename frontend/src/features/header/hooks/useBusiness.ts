import { useQuery } from '@tanstack/react-query';
import type { Business, BusinessResponse } from '../types/business.types';

const fetchBusiness = async (slug: string): Promise<Business> => {
  const response = await fetch(`/api/tenants/${slug}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch business data');
  }
  
  const result: BusinessResponse = await response.json();
  
  if (!result.success) {
    throw new Error('API returned error');
  }
  
  return result.data;
};

export const useBusiness = (slug: string) => {
  return useQuery({
    queryKey: ['business', slug],
    queryFn: () => fetchBusiness(slug),
    enabled: !!slug, // Only run query if slug exists
    staleTime: 10 * 60 * 1000, // 10 minutes - business data rarely changes
    retry: 2,
  });
};
