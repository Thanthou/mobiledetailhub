import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { scrollRestoration } from '@/shared/utils';

/**
 * Enhanced scroll restoration hook that handles both scroll-to-top
 * and scroll position restoration for better user experience.
 * Uses the advanced ScrollRestorationManager for better control.
 */
export const useScrollToTop = (): void => {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    // Save current scroll position before navigation
    if (prevPathRef.current) {
      scrollRestoration.saveScrollPosition(prevPathRef.current);
    }

    // Restore scroll position or scroll to top
    scrollRestoration.restoreScrollPosition(pathname);

    // Update previous path
    prevPathRef.current = pathname;
  }, [pathname]);
};
