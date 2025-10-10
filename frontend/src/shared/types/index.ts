export type { BusinessData, EmployeesData, ServiceArea } from './business';
export * from './gallery.types';
export * from './guards';
export * from './location';
export type { SiteActions,SiteContextType, SiteState } from './site';
export type { Business, BusinessResponse } from './tenant-business.types';

// Centralized tenant types
export type {
  AnalyticsConfig,
  BrandColors,
  ContactInfo,
  EmailAddresses,
  FAQItem,
  FeatureFlags,
  HeroContent,
  HeroMedia,
  IndustryType,  // Alias for Vertical (backward compatibility)
  LocationPage,
  Logo,
  PaymentConfig,
  PhoneNumbers,
  PricingUnit,
  SEOMetadata,
  Service,
  ServiceArea,
  ServiceAreaConfig,
  ServiceCatalog,
  ServiceCategory,
  ServiceTier,
  SizeBucket,
  SocialMediaLinks,
  TenantBranding,
  TenantConfig,
  TenantConfigUpdate,
  TenantCreatePayload,
  TenantId,
  TenantStatus,
  TenantSummary,
  TenantUserRole,
  VehicleType,
  Vertical} from './tenant.types';