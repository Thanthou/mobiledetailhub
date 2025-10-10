/**
 * Hook to check if reviews are available for the current site
 * Returns true if there are reviews, false otherwise
 * 
 * NOTE: This is a simplified version that always returns true.
 * The actual implementation should check if reviews exist for the current site.
 */
export const useReviewsAvailability = (): boolean => {
  // For now, always return true
  // TODO: Implement actual check for reviews availability
  // This could involve checking tenant config or making an API call
  return true;
};

