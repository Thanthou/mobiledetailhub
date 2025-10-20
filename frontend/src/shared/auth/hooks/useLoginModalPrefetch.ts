import { useCallback, useEffect, useState } from 'react';

import { usePerformanceMonitor } from '@shared/hooks';

// Enhanced prefetch function with better error handling and caching
const prefetchLoginModal = (() => {
  let prefetchPromise: Promise<unknown> | null = null;
  
  return () => {
    if (!prefetchPromise) {
      prefetchPromise = import('../components/LoginModal')
        .then(module => {
          // Pre-warm any dependencies or prepare the component
          return module;
        })
        .catch((error: unknown) => {
          console.error('Failed to prefetch LoginModal:', error);
          // Reset promise on error so retry is possible
          prefetchPromise = null;
          throw error;
        });
    }
    return prefetchPromise;
  };
})();

export const useLoginModalPrefetch = () => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const { startLoad, endLoad } = usePerformanceMonitor('LoginModal');

  // Enhanced prefetch logic with better caching
  const handlePrefetch = useCallback(async (): Promise<void> => {
    if (!isPreloaded && !isPreloading) {
      setIsPreloading(true);
      try {
        await import('../components/LoginModal');
        setIsPreloaded(true);
      } catch (error: unknown) {
        console.error('Failed to prefetch LoginModal:', error);
      } finally {
        setIsPreloading(false);
      }
    }
  }, [isPreloaded, isPreloading]);

  // Auto-prefetch after a delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      void handlePrefetch();
    }, 1500); // Prefetch after 1.5 seconds (login is more commonly used)
    
    return () => { clearTimeout(timer); };
  }, [handlePrefetch]);

  // Monitor component loading performance
  const handleOpen = useCallback(() => {
    startLoad();
    const timer = setTimeout(() => {
      endLoad();
    }, 100);
    return () => { clearTimeout(timer); };
  }, [startLoad, endLoad]);

  return {
    isPreloading,
    isPreloaded,
    handlePrefetch,
    handleOpen,
    prefetchLoginModal
  };
};

export { prefetchLoginModal };
