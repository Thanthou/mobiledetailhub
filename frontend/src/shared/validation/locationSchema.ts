/**
 * Zod validation schemas for location data
 * Ensures data integrity and provides clear error messages
 */

import { z } from 'zod';

// Image schema with performance optimization fields
const ImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().min(1, 'Image alt text is required'),
  caption: z.string().optional(),
  role: z.enum(['hero', 'gallery', 'process', 'result', 'auto', 'marine', 'rv'], {
    errorMap: () => ({ message: 'Image role must be one of: hero, gallery, process, result, auto, marine, rv' })
  }),
  width: z.number().positive('Image width must be positive').optional(),
  height: z.number().positive('Image height must be positive').optional(),
  priority: z.boolean().optional(),
  sources: z.array(z.object({
    srcset: z.string(),
    type: z.string()
  })).optional()
});

// Header schema for business information
const HeaderSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').optional(),
  phoneDisplay: z.string().min(1, 'Phone display format is required').optional(),
  phoneE164: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +1234567890)').optional(),
  cityStateLabel: z.string().min(1, 'City state label is required').optional()
});

// SEO schema
const SEOSchema = z.object({
  title: z.string().min(1, 'SEO title is required'),
  description: z.string().min(1, 'SEO description is required'),
  keywords: z.array(z.string()).optional(),
  canonicalPath: z.string().regex(/^\/.*\/?$/, 'Canonical path must start with /').optional(),
  ogImage: z.string().optional(),
  twitterImage: z.string().optional(),
  robots: z.enum(['index,follow', 'noindex,nofollow']).optional()
});

// Hero schema
const HeroSchema = z.object({
  h1: z.string().min(1, 'Hero H1 is required'),
  sub: z.string().optional()
});

// Operations schema
const OpsSchema = z.object({
  acceptsSameDay: z.boolean().optional(),
  leadTimeDays: z.number().int().min(0, 'Lead time days must be non-negative').max(30, 'Lead time days must be reasonable').optional(),
  serviceRadiusMiles: z.number().positive('Service radius must be positive').max(100, 'Service radius must be reasonable').optional()
});

// Service area schema
const ServiceAreaSchema = z.object({
  postalCodes: z.array(z.string().regex(/^\d{5}(-\d{4})?$/, 'Postal codes must be valid ZIP format')).min(1, 'At least one postal code is required')
});

// FAQ schema
const FAQSchema = z.object({
  id: z.string().optional(),
  q: z.string().min(1, 'FAQ question is required'),
  a: z.string().min(1, 'FAQ answer is required')
});

// Reviews section schema
const ReviewsSectionSchema = z.object({
  heading: z.string().min(1, 'Reviews heading is required').optional(),
  intro: z.string().min(1, 'Reviews intro is required').optional(),
  feedKey: z.string().optional()
});

// Schema.org schema (minimal validation since most fields are auto-generated)
const SchemaOrgSchema = z.object({
  // Manual fields only
  aggregateRating: z.object({
    '@type': z.string().optional(),
    ratingValue: z.string().optional(),
    reviewCount: z.string().optional(),
    bestRating: z.string().optional(),
    worstRating: z.string().optional()
  }).optional(),
  review: z.array(z.object({
    '@type': z.string().optional(),
    author: z.object({
      '@type': z.string().optional(),
      name: z.string().optional()
    }).optional(),
    reviewRating: z.object({
      '@type': z.string().optional(),
      ratingValue: z.string().optional(),
      bestRating: z.string().optional(),
      worstRating: z.string().optional()
    }).optional(),
    reviewBody: z.string().optional()
  })).optional(),
  openingHours: z.union([z.string(), z.array(z.string())]).optional(),
  // Allow additional schema properties
}).passthrough();

// Main LocationPage schema
export const LocationPageSchema = z.object({
  // Core identification
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  city: z.string().min(1, 'City is required'),
  stateCode: z.string().length(2, 'State code must be 2 characters').regex(/^[A-Z]{2}$/, 'State code must be uppercase'),
  state: z.string().min(1, 'State name is required'),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Postal code must be valid ZIP format'),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  openingHours: z.union([z.string(), z.array(z.string())]).optional(),
  urlPath: z.string().regex(/^\/.*\/$/, 'URL path must start and end with /'),
  
  // Affiliate/employee references
  affiliateRef: z.string().optional(),
  employee: z.string().optional(),
  
  // Header information
  header: HeaderSchema.optional(),
  
  // SEO
  seo: SEOSchema,
  
  // Hero
  hero: HeroSchema,
  
  // Content
  faqIntro: z.string().optional(),
  neighborhoods: z.array(z.string()).optional(),
  landmarks: z.array(z.string()).optional(),
  localConditions: z.array(z.string()).optional(),
  
  // Pricing
  pricingModifierPct: z.number().min(-0.5, 'Pricing modifier cannot be less than -50%').max(1.0, 'Pricing modifier cannot be more than +100%').optional(),
  
  // Images
  images: z.array(ImageSchema).optional(),
  
  // FAQs
  faqs: z.array(FAQSchema).optional(),
  
  // Reviews
  reviewsSection: ReviewsSectionSchema.optional(),
  
  // Operations
  ops: OpsSchema.optional(),
  
  // Service area
  serviceArea: ServiceAreaSchema.optional(),
  
  // Schema.org
  schemaOrg: SchemaOrgSchema.optional()
});

// Main site configuration schema
export const MainSiteConfigSchema = z.object({
  brand: z.string().min(1, 'Brand name is required'),
  slug: z.string().min(1, 'Slug is required'),
  urlPath: z.string().regex(/^\/.*\/?$/, 'URL path must start with /'),
  
  logo: z.object({
    url: z.string().min(1, 'Logo URL is required'),
    alt: z.string().min(1, 'Logo alt text is required'),
    darkUrl: z.string().optional(),
    lightUrl: z.string().optional()
  }),
  
  seo: SEOSchema,
  
  hero: HeroSchema.extend({
    images: z.array(ImageSchema).optional(),
    ctas: z.array(z.object({
      label: z.string(),
      href: z.string()
    })).optional()
  }),
  
  servicesGrid: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    image: z.string(),
    alt: z.string(),
    href: z.string(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    priority: z.boolean().optional()
  })).optional(),
  
  reviews: z.object({
    title: z.string(),
    subtitle: z.string(),
    ratingValue: z.string(),
    reviewCount: z.number(),
    source: z.string()
  }).optional(),
  
  faq: z.object({
    title: z.string(),
    subtitle: z.string()
  }).optional(),
  
  contact: z.object({
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone is required')
  }).optional(),
  
  socials: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    tiktok: z.string().url().optional(),
    youtube: z.string().url().optional(),
    googleBusiness: z.string().url().optional()
  }).optional(),
  
  jsonLd: z.object({
    organization: z.record(z.any()).optional(),
    website: z.record(z.any()).optional()
  }).optional()
});

// Validation helper functions
export function validateLocationData(data: unknown) {
  try {
    return {
      success: true,
      data: LocationPageSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    throw error;
  }
}

export function validateMainSiteConfig(data: unknown) {
  try {
    return {
      success: true,
      data: MainSiteConfigSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    throw error;
  }
}

// Type exports for use in other files
export type LocationPageData = z.infer<typeof LocationPageSchema>;
export type MainSiteConfigData = z.infer<typeof MainSiteConfigSchema>;
export type ValidationResult<T> = {
  success: boolean;
  data: T | null;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }> | null;
};
