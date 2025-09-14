import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';

type Review = { 
  rating: number;
  id?: string;
  comment?: string;
  author?: string;
  created_at?: string;
};

type ReviewsData = {
  averageRating: number;
  totalReviews: number;
};

export function useReviews() {
  const { isAffiliate } = useSiteContext();
  const { affiliateData } = useAffiliate();
  const affiliateId = affiliateData?.id ? String(affiliateData.id) : '';

  const { url, key } = useMemo(() => {
    if (isAffiliate && affiliateId) {
      return {
        url: `/api/reviews?type=affiliate&affiliate_id=${affiliateId}&status=approved&limit=100`,
        key: ['reviews', 'affiliate', affiliateId] as const,
      };
    }
    return { url: '/api/reviews?type=mdh&status=approved&limit=100', key: ['reviews', 'mdh'] as const };
  }, [isAffiliate, affiliateId]);

  const q = useQuery<Review[], Error, ReviewsData>({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`Reviews API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json() as { success: boolean; data: Review[] };
      if (!json.success) {
        throw new Error('Invalid response format from reviews API');
      }
      return json.data || [];
    },
    select: (list: Review[]): ReviewsData => {
      if (!list || list.length === 0) {
        return { averageRating: 4.9, totalReviews: 0 };
      }
      
      const sum = list.reduce((acc, review) => acc + review.rating, 0);
      const total = list.length;
      const average = Math.round((sum / total) * 10) / 10; // Round to 1 decimal place
      
      return { averageRating: average, totalReviews: total };
    },
    staleTime: 30 * 60_000, // 30 minutes
    gcTime: 60 * 60_000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
  });

  return {
    averageRating: q.data?.averageRating ?? 4.9,
    totalReviews: q.data?.totalReviews ?? 0,
    isInitialLoading: q.isLoading,
    isRefreshing: q.isFetching && !q.isLoading,
    error: q.error ? { 
      message: q.error.message, 
      status: (q.error as any)?.status 
    } : null,
    refetch: q.refetch,
    isStale: q.isStale,
  };
}

// Export as alias for backward compatibility
export const useReviewsRQ = useReviews;
