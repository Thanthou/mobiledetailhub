// UI utilities
export { cn } from './cn';

// Performance utilities
export { performanceMonitor, usePerformanceMonitor } from './performance';

// Scroll utilities
export { scrollRestoration, useScrollRestoration } from './scrollRestoration';
export { scrollToTop, scrollToTopImmediate } from './scrollToTop';

// Validation utilities
export {
  type FieldValidation,
  sanitizeHtml,
  sanitizeText,
  validateEmail,
  validateFormData,
  validateMessage,
  validateName,
  validatePassword,
  validatePhone,
  validateService,
  validateTextField,
  validateVehicleField,
  type ValidationResult
} from './validation';

// Phone formatting utilities
export {
  formatPhoneNumber,
  formatPhoneNumberAsTyped,
  getPhoneDigits,
  isCompletePhoneNumber
} from './phoneFormatter';

// Auto-save utility
export { useAutoSave } from './useAutoSave';

// Date formatting utilities
export {
  addDays,
  addMonths,
  formatDateCompact,
  formatDateForDisplay,
  formatDateShort,
  formatDateToYYYYMMDD,
  formatMonthYear,
  formatWeekRange,
  getDayName,
  getDayNameShort,
  getToday,
  getWeekDates,
  isFuture,
  isPast,
  isToday,
  parseLocalDate} from './dateFormatter';

// Currency formatting utilities
export {
  formatCurrency,
  formatCurrencyCompact,
  formatDiscount,
  formatDollars,
  formatPercentage,
  formatPrice,
  formatPriceNoSymbol,
  formatPriceRange,
  formatPriceWithTax,
  parseCurrency} from './currencyFormatter';

// Modal code-splitting utilities
export {
  getModalPrefetchManager,
  type ModalPrefetchConfig,
  type ModalType,
  type PrefetchStrategy,
  preloadCriticalModals,
  useModalPrefetch,
  useModalTriggerRef} from './modalCodeSplitting';

// Product comparison utilities
export {
  DEFAULT_RATINGS,
  METRIC_LABELS,
  type MetricKey,
  PRODUCT_COLORS,
  PRODUCT_LABELS,
  type ProductKey,
  type Ratings
} from './protectionComparison';

// Business utilities
export { findBusinessByLocation } from './findBusinessByLocation';


// Legacy business utilities removed - now using DataProvider for tenant-based routing

// Site data utilities
export {
  formatContactInfo,
  formatFAQ,
  formatHero,
  formatReviews,
  formatSEO,
  formatServices,
  formatSiteData,
  formatSocialMedia,
  getAbsoluteUrl,
  getBusinessInfo} from './siteUtils';

// Legacy areas utilities removed - no longer needed for tenant-based routing

// Locations data utilities (simplified locations.json format)
export {
  getAllLocations,
  getFooterLocations,
  getLocationsByState,
  type LocationInfo,
  type LocationStateInfo
} from './locationsUtils';

// Image rotation utilities
export {
  createDebouncedRotation,
  getAccessibilityAttributes,
  getImageOpacityClasses,
  getNextImageIndex,
  getPreviousImageIndex,
  getTransitionDuration,
  getTransitionStyles,
  getVisibleImageIndices,
  type ImageRotationActions,
  type ImageRotationConfig,
  type ImageRotationState,
  preloadImage,
  preloadImages,
  validateImageRotationConfig} from './imageRotation';

// Responsive image utilities
export {
  generateSrcSet,
  getCardImageSizes,
  getHeroImageSizes,
  getServiceImageSizes} from './imageUtils';

// Image rotation hooks moved to @/shared/hooks

// Logger utility
export { default as logger } from './logger';

// Tenant config migration utilities
export {
  affiliateToTenantConfig,
  type LegacyTenantConfig,
  legacyToTenantConfig,
  tenantConfigToLegacy} from './tenantConfigMigration';

// Tenant asset locator utilities
export {
  type AssetExtension,
  type AssetLocatorOptions,
  type AssetType,
  getTenantAssetUrl,
  getTenantAssetUrls,
  getTenantLogoUrls,
  hasFileExtension,
  type LogoUrls,
  normalizeAssetUrl} from './assetLocator';