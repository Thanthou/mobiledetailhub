import { useReviews } from '@tenant-app/components/reviews/hooks/useReviews';
import type { ReviewQueryParams } from '@tenant-app/components/reviews/types';
import { useDataOptional } from '@shared/hooks/useData';

/**
 * Hook to check if reviews are available for the current site
 * Returns true if there are reviews, false otherwise
 */
export const useReviewsAvailability = (): boolean => {
  const data = useDataOptional();
  const isTenant = data?.isTenant || false;
  const isPreview = data?.isPreview || false;
  
  // In preview mode, always show reviews (we have mock data)
  if (isPreview) {
    return true;
  }
  
  // Build query parameters for availability check only
  const queryParams: ReviewQueryParams = {
    limit: 1
  };
  
  // For tenant sites, get the tenant slug from the URL
  if (isTenant) {
    const urlSlug = window.location.pathname.split('/')[1];
    if (urlSlug) {
      queryParams.tenant_slug = urlSlug;
    }
  }
  
  // Fetch reviews with tenant-specific filtering
  const { reviews, loading } = useReviews(queryParams);
  
  // Only return true if we have reviews and are not loading
  return !loading && reviews.length > 0;
};

