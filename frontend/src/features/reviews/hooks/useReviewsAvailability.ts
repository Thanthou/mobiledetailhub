import { useReviews } from './useReviews';
import { useData } from '@/features/header';

/**
 * Hook to check if reviews are available for the current site
 * Returns true if there are reviews, false otherwise
 */
export const useReviewsAvailability = (): boolean => {
  // Get tenant data
  let tenantData = null;
  try {
    tenantData = useData();
  } catch {
    // Not in tenant context, return false
    return false;
  }

  // Get business slug from URL
  const businessSlug = window.location.pathname.split('/')[1];
  
  // Fetch reviews to check if any exist
  const queryParams = {
    tenant_slug: businessSlug,
    limit: 1 // Only need to check if any exist
  };
  
  const { reviews, isLoading } = useReviews(queryParams);


  // Return true if reviews exist and are not loading
  return !isLoading && reviews && reviews.length > 0;
};
