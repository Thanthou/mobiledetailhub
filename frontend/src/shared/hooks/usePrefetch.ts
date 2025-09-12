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
 * Hook specifically for prefetching modals with enhanced caching
 */
export const useModalPrefetch = () => {
  const { prefetch } = usePrefetch();

  const prefetchQuoteModal = useCallback(() => {
    prefetch(() => {
      void import('@/features/booking/components/QuoteModal');
    }, 'quoteModal');
  }, [prefetch]);

  const prefetchLoginModal = useCallback(() => {
    prefetch(() => {
      void import('@/features/auth/components/LoginModal');
    }, 'loginModal');
  }, [prefetch]);

  // Enhanced prefetch with intersection observer for viewport-based loading
  const prefetchOnViewport = useCallback((target: HTMLElement, modalType: 'quote' | 'login') => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (modalType === 'quote') {
              prefetchQuoteModal();
            } else {
              prefetchLoginModal();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(target);
    return () => { observer.disconnect(); };
  }, [prefetchQuoteModal, prefetchLoginModal]);

  return {
    prefetchQuoteModal,
    prefetchLoginModal,
    prefetchOnViewport
  };
};
