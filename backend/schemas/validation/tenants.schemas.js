/**
 * Tenant Validation Schemas
 * 
 * Validation rules for tenant/business management:
 * - Tenant signup/onboarding
 * - Business profile updates
 * - Service area management
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Tenant API Schemas
 */
export const tenantSchemas = {
  // POST /api/tenants/signup
  signup: z.object({
    // Personal information
    firstName: commonFields.name,
    lastName: commonFields.name,
    personalPhone: commonFields.phone,
    personalEmail: commonFields.email,
    
    // Business information
    businessName: commonFields.businessName,
    businessPhone: commonFields.phone,
    businessEmail: commonFields.email.optional(),
    businessAddress: z.object({
      address: commonFields.address,
      city: commonFields.city,
      state: commonFields.state,
      zip: commonFields.zip
    }),
    
    // Plan information
    selectedPlan: z.enum(['basic', 'premium', 'enterprise']),
    planPrice: commonFields.price,
    industry: z.enum(['mobile-detailing', 'house-cleaning', 'lawn-care', 'pet-grooming', 'barber-shop']).default('mobile-detailing'),
    
    // Defaults (optional)
    defaults: z.object({
      content: z.object({
        hero: z.object({
          h1: z.string().optional(),
          subTitle: z.string().optional()
        }).optional(),
        reviews: z.object({
          title: z.string().optional(),
          subtitle: z.string().optional()
        }).optional(),
        faq: z.object({
          title: z.string().optional(),
          subtitle: z.string().optional()
        }).optional()
      }).optional(),
      seo: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.string().optional(),
        ogImage: z.string().optional(),
        twitterImage: z.string().optional(),
        canonicalPath: z.string().optional(),
        robots: z.string().optional()
      }).optional(),
      faqItems: z.array(z.object({
        question: z.string(),
        answer: z.string()
      })).optional()
    }).optional()
  }),
  
  // GET /api/tenants/:slug
  getBySlug: z.object({
    slug: commonFields.slug
  }),
  
  // GET /api/tenants
  list: z.object({
    industry: z.enum(['mobile-detailing', 'house-cleaning', 'lawn-care', 'pet-grooming', 'barber-shop']).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    limit: commonFields.limit,
    offset: commonFields.offset
  })
};

/**
 * Service Areas API Schemas
 */
export const serviceAreaSchemas = {
  // PUT /api/locations/service-areas/:slug
  update: z.object({
    serviceAreas: commonFields.serviceAreas
  }),
  
  // POST /api/locations/service-areas/:slug
  add: z.object({
    city: commonFields.city,
    state: commonFields.state,
    zip: commonFields.zip.optional(),
    minimum: z.number().min(0).default(0),
    multiplier: z.number().min(0).max(10).default(1.0)
  })
};

