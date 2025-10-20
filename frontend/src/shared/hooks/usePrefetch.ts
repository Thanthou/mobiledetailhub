import { useCallback, useRef } from 'react';

/**
 * Custom hook for prefetching lazy-loaded components
 * Provides prefetch functions that can be used on hover, focus, or other events
 */
export const usePrefetch = () => {
  const prefetchedRef = useRef<Set<string>>(new Set());

  const prefetch = useCallback((prefetchFn: () => void | Promise<void>, key: string) => {
    if (!prefetchedRef.current.has(key)) {
      prefetchedRef.current.add(key);
      void prefetchFn();
    }
  }, []);

  const isPrefetched = useCallback((key: string) => {
    return prefetchedRef.current.has(key);
  }, []);

  const clearPrefetched = useCallback(() => {
    prefetchedRef.current.clear();
  }, []);

  return {
    prefetch,
    isPrefetched,
    clearPrefetched
  };
};

/**
 * Hook for modal prefetching
 * @deprecated Use useModalPrefetch from '@shared/utils/modalCodeSplitting' instead
 * This provides better architecture with a registry pattern
 */
export const useModalPrefetch = () => {
  console.warn('useModalPrefetch from usePrefetch.ts is deprecated. Use the one from @shared/utils/modalCodeSplitting instead');
  
  return {
    prefetchQuoteModal: () => { /* deprecated */ },
    prefetchLoginModal: () => { /* deprecated */ },
    prefetchOnViewport: () => { /* deprecated */ }
  };
};
