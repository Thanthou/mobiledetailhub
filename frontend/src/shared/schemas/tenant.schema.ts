/**
 * Tenant Configuration Zod Schemas
 * Runtime validation for tenant configs loaded from API/files
 * 
 * Philosophy: Match the minimal TypeScript types
 * - Only 10 core fields are required
 * - Everything else is optional (for future features)
 * - Provides runtime safety at API boundaries
 */

import { z } from 'zod';

// ============================================================================
// Core Identification Schemas
// ============================================================================

/**
 * Vertical schema - uses kebab-case to match database and file paths
 */
export const VerticalSchema = z.enum([
  'mobile-detailing',
  'pet-grooming',
  'lawn-care',
  'house-cleaning',
  'hvac',
  'plumbing',
  'electrical'
]);

/**
 * Legacy alias for backward compatibility
 * @deprecated Use VerticalSchema instead
 */
export const IndustryTypeSchema = VerticalSchema;

export const TenantStatusSchema = z.enum([
  'pending',
  'approved',
  'active',
  'suspended',
  'rejected'
]);

export const TenantUserRoleSchema = z.enum([
  'owner',
  'manager',
  'tech',
  'viewer'
]);

// ============================================================================
// Service Catalog Schemas
// ============================================================================

export const ServiceCategorySchema = z.enum([
  'interior',
  'exterior',
  'service-packages',
  'addons',
  'ceramic-coating',
  'paint-correction',
  'paint-protection-film',
  'auto',
  'boat',
  'rv',
  'ppf',
  'ceramic'
]);

export const VehicleTypeSchema = z.enum([
  'auto',
  'boat',
  'rv',
  'truck',
  'motorcycle',
  'off-road'
]);

export const SizeBucketSchema = z.enum(['xs', 's', 'm', 'l', 'xl']);

export const PricingUnitSchema = z.enum(['flat', 'hour']);

export const ServiceTierSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, 'Tier name is required'),
  priceCents: z.number().int().nonnegative('Price must be non-negative'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  description: z.string(),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
  enabled: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional()
});

export const ServiceSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().optional(),
  category: ServiceCategorySchema,
  description: z.string().optional(),
  vehicleTypes: z.array(VehicleTypeSchema).optional(),
  basePriceCents: z.number().int().nonnegative().optional(),
  pricingUnit: PricingUnitSchema.optional(),
  minDurationMinutes: z.number().int().positive().optional(),
  tiers: z.array(ServiceTierSchema).optional(),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  metadata: z.record(z.unknown()).optional()
});

export const ServiceCatalogSchema = z.record(
  z.string(),
  z.array(ServiceSchema)
);

// ============================================================================
// Branding Schemas
// ============================================================================

const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color');

export const BrandColorsSchema = z.object({
  primary: HexColorSchema.optional(),
  secondary: HexColorSchema.optional(),
  accent: HexColorSchema.optional(),
  background: HexColorSchema.optional(),
  text: HexColorSchema.optional(),
  textLight: HexColorSchema.optional()
}).optional();

// Logo Schema - REQUIRED: url
export const LogoSchema = z.object({
  url: z.string().min(1, 'Logo URL is required'),  // ✓ REQUIRED
  alt: z.string().optional(),
  darkUrl: z.string().optional(),
  lightUrl: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});

// Branding Schema - REQUIRED: businessName, logo
export const TenantBrandingSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),  // ✓ REQUIRED
  logo: LogoSchema,  // ✓ REQUIRED (at least logo.url)
  tagline: z.string().optional(),
  favicon: z.string().optional(),
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional()
  }).optional(),
  theme: z.enum(['default', 'southwest', 'coastal', 'modern', 'classic']).optional()
});

// ============================================================================
// Contact & Social Schemas
// ============================================================================

// Helper schemas for validation
const PhoneSchema = z.string().min(1, 'Phone number is required');
// eslint-disable-next-line @typescript-eslint/no-deprecated -- z.string().email() is the correct modern Zod syntax despite deprecation warning
const EmailSchema = z.string().email('Must be a valid email address');
// eslint-disable-next-line @typescript-eslint/no-deprecated -- z.string().url() is the correct modern Zod syntax despite deprecation warning
const URLSchema = z.string().url('Must be a valid URL');

export const PhoneNumbersSchema = z.object({
  main: PhoneSchema,  // ✓ REQUIRED
  sms: z.string().optional(),
  twilio: z.string().optional()
});

export const EmailAddressesSchema = z.object({
  primary: EmailSchema,  // ✓ REQUIRED
  support: EmailSchema.optional(),
  billing: EmailSchema.optional()
});

export const SocialMediaLinksSchema = z.object({
  facebook: z.string(),  // ✓ REQUIRED (can be empty string)
  instagram: z.string(),  // ✓ REQUIRED (can be empty string)
  tiktok: z.string(),  // ✓ REQUIRED (can be empty string)
  youtube: z.string(),  // ✓ REQUIRED (can be empty string)
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  yelp: z.string().optional(),
  gbp: z.string().optional()
});

export const BaseLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),  // ✓ REQUIRED
  state: z.string().min(1, 'State is required')  // ✓ REQUIRED
});

export const ContactInfoSchema = z.object({
  phones: PhoneNumbersSchema,  // ✓ REQUIRED
  emails: EmailAddressesSchema,  // ✓ REQUIRED
  socials: SocialMediaLinksSchema,  // ✓ REQUIRED
  baseLocation: BaseLocationSchema,  // ✓ REQUIRED
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

// ============================================================================
// Service Area Schemas
// ============================================================================

export const ServiceAreaSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  city: z.string().min(1, 'City is required'),
  citySlug: z.string().min(1, 'City slug is required'),
  stateCode: z.string().length(2, 'State code must be 2 characters'),
  stateName: z.string().min(1, 'State name is required'),
  zipCodes: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusMiles: z.number().int().positive().optional()
});

export const ServiceAreaConfigSchema = z.record(
  z.string().length(2), // State code
  z.array(ServiceAreaSchema)
);

// ============================================================================
// SEO & Page Configuration Schemas
// ============================================================================

export const SEOMetadataSchema = z.object({
  title: z.string().min(1, 'SEO title is required').max(60, 'SEO title should be under 60 characters'),
  description: z.string().min(1, 'SEO description is required').max(160, 'SEO description should be under 160 characters'),
  keywords: z.array(z.string()).optional(),
  canonicalPath: z.string().optional(),
  ogImage: URLSchema.optional(),
  twitterImage: URLSchema.optional(),
  robots: z.enum(['index,follow', 'noindex,nofollow']).optional()
});

export const HeroContentSchema = z.object({
  h1: z.string().min(1, 'Hero headline is required'),
  subtitle: z.string().optional(),
  ctas: z.array(z.object({
    label: z.string().min(1),
    href: z.string(),
    variant: z.enum(['primary', 'secondary']).optional()
  })).optional()
});

export const FAQItemSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional()
});

export const LocationPageSchema = z.object({
  slug: z.string().min(1, 'Location slug is required'),
  city: z.string().min(1, 'City is required'),
  stateCode: z.string().length(2),
  state: z.string().min(1),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  urlPath: z.string().min(1, 'URL path is required'),
  affiliateRef: z.string().optional(),
  seo: SEOMetadataSchema,
  hero: HeroContentSchema,
  faqIntro: z.string().optional(),
  faqs: z.array(FAQItemSchema).optional(),
  neighborhoods: z.array(z.string()).optional(),
  landmarks: z.array(z.string()).optional(),
  localConditions: z.array(z.string()).optional(),
  pricingModifierPct: z.number().min(-1).max(1).optional(),
  images: z.array(z.object({
    url: URLSchema,
    alt: z.string().min(1),
    role: z.enum(['hero', 'gallery', 'service']).optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    priority: z.boolean().optional()
  })).optional(),
  reviews: z.object({
    ratingValue: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().nonnegative().optional(),
    featured: z.array(z.string()).optional()
  }).optional(),
  openingHours: z.union([z.string(), z.array(z.string())]).optional()
});

// ============================================================================
// Integration Schemas
// ============================================================================

export const AnalyticsConfigSchema = z.object({
  ga4: z.string().optional(),
  googleAdsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  hotjarId: z.string().optional()
}).optional();

export const PaymentConfigSchema = z.object({
  stripePublishableKey: z.string().optional(),
  stripeAccountId: z.string().optional(),
  acceptsPayments: z.boolean().optional().default(false),
  depositRequired: z.boolean().optional().default(false),
  depositPercentage: z.number().min(0).max(1).optional()
}).optional();

export const FeatureFlagsSchema = z.object({
  bookingEnabled: z.boolean().optional().default(false),
  loginEnabled: z.boolean().optional().default(false),
  reviewsEnabled: z.boolean().optional().default(true),
  blogEnabled: z.boolean().optional().default(false),
  referralProgramEnabled: z.boolean().optional().default(false),
  loyaltyProgramEnabled: z.boolean().optional().default(false),
  smsNotificationsEnabled: z.boolean().optional().default(false),
  emailNotificationsEnabled: z.boolean().optional().default(true)
}).optional();

// ============================================================================
// Complete Tenant Configuration Schema
// ============================================================================

// ============================================================================
// Main Tenant Configuration Schema
// ============================================================================

export const TenantConfigSchema = z.object({
  // ============================================
  // CORE IDENTITY (4 required)
  // ============================================
  id: z.union([z.string(), z.number()]),  // ✓ REQUIRED
  slug: z.string().min(1, 'Tenant slug is required'),  // ✓ REQUIRED
  vertical: VerticalSchema,  // ✓ REQUIRED
  status: TenantStatusSchema,  // ✓ REQUIRED
  
  // ============================================
  // BRANDING (2 required nested)
  // ============================================
  branding: TenantBrandingSchema,  // ✓ REQUIRED
  
  // ============================================
  // CONTACT (4 required nested)
  // ============================================
  contact: ContactInfoSchema,  // ✓ REQUIRED
  
  // ============================================
  // FUTURE FEATURES (all optional)
  // ============================================
  services: ServiceCatalogSchema.optional(),
  enabledServiceCategories: z.array(ServiceCategorySchema).optional(),
  
  serviceAreas: ServiceAreaConfigSchema.optional(),
  serviceRadiusMiles: z.number().int().positive().optional(),
  
  locationPages: z.array(LocationPageSchema).optional(),
  mainSiteSEO: SEOMetadataSchema.optional(),
  
  analytics: AnalyticsConfigSchema.optional(),
  payment: PaymentConfigSchema.optional(),
  features: FeatureFlagsSchema.optional(),
  
  domains: z.array(z.string()).optional(),
  primaryDomain: z.string().optional(),
  
  businessLicense: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  operatingHours: z.record(
    z.string(),
    z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional()
    })
  ).optional(),
  
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  totalJobs: z.number().int().nonnegative().optional(),
  
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  approvedAt: z.string().optional()
});

// ============================================================================
// Helper Schemas
// ============================================================================

export const TenantConfigUpdateSchema = TenantConfigSchema.partial();

export const TenantSummarySchema = z.object({
  id: z.union([z.string(), z.number()]),
  slug: z.string(),
  businessName: z.string(),
  vertical: VerticalSchema,
  status: TenantStatusSchema,
  mainPhone: z.string(),
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- z.string().email() is the correct modern Zod syntax despite deprecation warning
  email: z.string().email('Must be a valid email address'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional()
});

export const TenantCreatePayloadSchema = TenantConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true
});

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate tenant config with detailed error reporting
 */
export function validateTenantConfig(data: unknown): {
  success: boolean;
  data?: z.infer<typeof TenantConfigSchema>;
  errors?: z.ZodError;
} {
  try {
    const validated = TenantConfigSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Safe parse tenant config (returns null on error instead of throwing)
 */
export function safeParseTenantConfig(data: unknown) {
  return TenantConfigSchema.safeParse(data);
}

/**
 * Validate service catalog
 */
export function validateServiceCatalog(data: unknown) {
  return ServiceCatalogSchema.safeParse(data);
}

/**
 * Validate location page
 */
export function validateLocationPage(data: unknown) {
  return LocationPageSchema.safeParse(data);
}

