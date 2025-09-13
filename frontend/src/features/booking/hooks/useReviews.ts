import { useCallback, useEffect, useState } from 'react';

import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useSiteContext } from '@/shared/hooks';

export const useReviews = () => {
  const { isAffiliate } = useSiteContext();
  const { affiliateData } = useAffiliate();
  
  const [averageRating, setAverageRating] = useState<number>(4.9);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = '/api/reviews?type=mdh&status=approved&limit=100';
        
        // If we're on an affiliate page, fetch affiliate reviews
        if (isAffiliate && affiliateData?.id) {
          url = `/api/reviews?type=affiliate&affiliate_id=${String(affiliateData.id)}&status=approved&limit=100`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json() as { success: boolean; data: { rating: number }[] };
          if (data.success && data.data.length > 0) {
            const reviews = data.data;
            const totalRating = reviews.reduce((sum: number, review) => sum + review.rating, 0);
            const average = totalRating / reviews.length;
            setAverageRating(Math.round(average * 10) / 10); // Round to 1 decimal place
            setTotalReviews(reviews.length);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep default values if fetch fails
      }
    };
    
    void fetchReviews();
  }, [isAffiliate, affiliateData]);

  return {
    averageRating,
    totalReviews,
  };
};
