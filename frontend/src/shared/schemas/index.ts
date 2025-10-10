/**
 * Centralized Zod Schemas
 * Export all validation schemas for use across the application
 */

// Tenant schemas
export {
  // Integration schemas (future)
  AnalyticsConfigSchema,
  BaseLocationSchema,
  // Branding schemas
  BrandColorsSchema,
  ContactInfoSchema,
  EmailAddressesSchema,
  FAQItemSchema,
  FeatureFlagsSchema,
  HeroContentSchema,
  IndustryTypeSchema,
  LocationPageSchema,
  LogoSchema,
  PaymentConfigSchema,
  // Contact schemas
  PhoneNumbersSchema,
  PricingUnitSchema,
  safeParseTenantConfig,
  // SEO & content schemas (future)
  SEOMetadataSchema,
  ServiceAreaConfigSchema,
  // Geographic schemas (future)
  ServiceAreaSchema,
  ServiceCatalogSchema,
  // Service schemas (future)
  ServiceCategorySchema,
  ServiceSchema,
  ServiceTierSchema,
  SizeBucketSchema,
  SocialMediaLinksSchema,
  TenantBrandingSchema,
  // Main config schemas
  TenantConfigSchema,
  TenantConfigUpdateSchema,
  TenantCreatePayloadSchema,
  TenantStatusSchema,
  TenantSummarySchema,
  TenantUserRoleSchema,
  validateLocationPage,
  validateServiceCatalog,
  // Validation helpers
  validateTenantConfig,
  VehicleTypeSchema,
  // Core schemas
  VerticalSchema} from './tenant.schema';

// Booking schemas
export * from './booking';
