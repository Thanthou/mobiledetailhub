import { useCallback } from 'react';

import { performanceMonitor } from '@/shared/utils';

/**
 * Hook for monitoring component performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startLoad = useCallback(() => {
    performanceMonitor.startTiming(componentName);
  }, [componentName]);

  const endLoad = useCallback(() => {
    performanceMonitor.endTiming(componentName, 'load');
  }, [componentName]);

  const startPrefetch = useCallback(() => {
    performanceMonitor.startTiming(componentName);
  }, [componentName]);

  const endPrefetch = useCallback(() => {
    performanceMonitor.endTiming(componentName, 'prefetch');
  }, [componentName]);

  return {
    startLoad,
    endLoad,
    startPrefetch,
    endPrefetch
  };
};
