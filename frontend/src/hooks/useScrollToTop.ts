import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

/**
 * Custom hook that automatically scrolls to the top of the page
 * whenever the route changes. This ensures users land at the top
 * after navigation, including Google search routing.
 */
export const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    scrollToTop();
  }, [pathname]);
};
