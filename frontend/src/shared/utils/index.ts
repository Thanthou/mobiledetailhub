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


// Business utilities
export {
  getBusinessBySlug,
  getAllBusinessSlugs,
  getBusinessName,
  getBusinessPhone,
  getBusinessEmail,
  getBusinessUrl,
  getBusinessLogo,
  getBusinessDescription,
  getBusinessServices,
  getBusinessHours,
  getBusinessServiceAreas
} from './businessUtils';

// Site data utilities
export {
  formatContactInfo,
  formatSocialMedia,
  formatSEO,
  formatHero,
  formatServices,
  formatReviews,
  formatFAQ,
  getBusinessInfo,
  formatSiteData,
  getAbsoluteUrl
} from './siteUtils';

// Areas data utilities
export {
  getAllAreas,
  getAreasByState,
  getAreasStates,
  getCitiesForState,
  getAreaBySlug,
  getAreaByCityState,
  searchAreasByCity,
  getFooterAreas,
  type AreaInfo,
  type StateInfo
} from './areasUtils';

// Image rotation utilities
export {
  type ImageRotationConfig,
  type ImageRotationState,
  type ImageRotationActions,
  getNextImageIndex,
  getPreviousImageIndex,
  preloadImage,
  preloadImages,
  getTransitionDuration,
  getImageOpacityClasses,
  getTransitionStyles,
  getVisibleImageIndices,
  validateImageRotationConfig,
  createDebouncedRotation,
  getAccessibilityAttributes
} from './imageRotation';

export {
  type UseImageRotationReturn,
  useImageRotation,
  useImageRotationHover
} from './useImageRotation';

export { default as ImageCarousel } from './ImageCarousel';