// Context hooks
export { useAuth } from './useAuth';

// SEO & Browser Tab Management
export { setBrowserTab, setBrowserTitle, setFavicon, useBrowserTab } from './useBrowserTab';
export { usePageTitle } from './usePageTitle';
export { useFavicon } from './useFavicon';
export { setMetaDescription, setOgImage, useMetaTags } from './useMetaTags';
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
export { 
  BREAKPOINTS,
  useBreakpoint,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useMediaQuery
} from './useMediaQuery';
export { useMobileDetection } from './useMobileDetection';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useModalPrefetch, usePrefetch } from './usePrefetch';
export { usePWAStatus } from './usePWAStatus';
export { useScrollSpy } from './useScrollSpy';
export { useScrollToTop } from './useScrollToTop';

// Image rotation hooks
export { useImageRotation, useImageRotationHover } from './useImageRotation';

// Industry-specific site data hook
export { useIndustrySiteData } from './useIndustrySiteData';

// Config loaders (centralized tenant + industry configuration)
// NOTE: DataContext and DataProvider moved to direct import to avoid circular dependency
// import { DataContext, DataProvider } from '../contexts/DataContext';
export { useData, useDataOptional } from './useData';
export { prefetchIndustryConfig,useIndustryConfig } from './useIndustryConfig';

// Tenant data hooks
export { useTenantData } from './useTenantData';
export { useTenantSlug } from './useTenantSlug';

// Tenant dashboard hooks
export {
  useTenantDashboard,
  useTenantOverview,
  useTenantReviews,
  useTenantPerformance,
  useTenantActivity,
  useDashboardHealth,
  useDashboardSummary,
  useRefreshDashboard,
  useDashboardLoadingStates,
  useDashboardErrors
} from './useTenantDashboard';

// Vehicle data hook
export { useVehicleData } from './useVehicleData';

// Reviews availability hook
export { useReviewsAvailability } from './useReviewsAvailability';

// Legacy business data hooks removed - now using DataProvider for tenant-based routing