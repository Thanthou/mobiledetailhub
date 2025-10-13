// Context hooks
export { useAuth } from './useAuth';
export { useTenantConfig } from './useTenantConfig';

// Tenant config loader (React Query based)
export { useSEO } from './useSEO';
export {
  prefetchTenantConfig,
  useTenantConfigLoader,
  useTenantsList} from './useTenantConfigLoader';
// Legacy useSiteContext removed - use DataProvider instead for tenant-based sites
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
export { useScrollSpy } from './useScrollSpy';
export { useScrollToTop } from './useScrollToTop';

// Image rotation hooks
export { useImageRotation, useImageRotationHover } from './useImageRotation';

// Industry-specific site data hook
export { useIndustrySiteData } from './useIndustrySiteData';

// Vehicle data hook
export { useVehicleData } from './useVehicleData';

// Reviews availability hook
export { useReviewsAvailability } from './useReviewsAvailability';

// Legacy business data hooks removed - now using DataProvider for tenant-based routing