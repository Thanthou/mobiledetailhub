// Context hooks
export { useAuth } from './useAuth';
export { useFAQ } from './useFAQ';
export { useLocation } from './useLocation';
export { useMDHConfig } from './useMDHConfig';
export { useSEO } from './useSEO';
export { useSiteContext } from '../utils/siteContext';
export { useToast } from './useToast';

// Error boundary hooks
export { useErrorBoundary } from './useErrorBoundary';
export { withAsyncErrorBoundary, withErrorBoundary } from './withErrorBoundary';

// Generic utility hooks
export { useDebouncedValue } from './useDebouncedValue';
export { useEventListener } from './useEventListener';
export { useLocalStorage } from './useLocalStorage';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useModalPrefetch, usePrefetch } from './usePrefetch';
export { useScrollToTop } from './useScrollToTop';

// Business data hooks
export { useBusinessData, useBusinessDataBySlug } from './useBusinessData';