/**
 * API Validation Schemas using Zod
 * Comprehensive schemas for all API endpoints with consistent validation
 */

import { z } from 'zod';

/**
 * Common field schemas for reuse
 */
const commonFields = {
  // Basic fields
  id: z.string().uuid().optional(),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s'\-.]+$/, 'Name must contain only letters, spaces, hyphens, apostrophes, and periods'),
  phone: z.string().regex(/^\+?1?\d{10,15}$/, 'Phone must be 10-15 digits with optional country code'),
  
  // Address fields
  address: z.string().min(5).max(255),
  city: z.string().min(2).max(100).regex(/^[a-zA-Z\s'\-.]+$/, 'City must contain only letters, spaces, hyphens, apostrophes, and periods'),
  state: z.string().length(2).regex(/^[A-Z]{2}$/, 'State must be a 2-letter uppercase code'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP must be 5 digits or 5+4 format'),
  
  // Business fields
  businessName: z.string().min(2).max(100).regex(/^[a-zA-Z0-9\s.,&'\-()!?@#+$%:;]+$/, 'Business name contains invalid characters'),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  
  // URL fields
  url: z.string().url().max(500),
  website: z.string().url().max(500).optional(),
  
  // Numeric fields
  rating: z.number().min(1).max(5),
  amount: z.number().min(0).max(999999.99),
  price: z.number().min(0).max(999999.99),
  
  // Date fields
  date: z.string().datetime().optional(),
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  
  // Boolean fields
  isActive: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
  
  // JSON fields
  metadata: z.record(z.any()).optional(),
  serviceAreas: z.array(z.object({
    id: z.string().optional(),
    city: z.string().min(2).max(100),
    state: z.string().length(2).regex(/^[A-Z]{2}$/),
    zip: z.number().int().min(10000).max(99999).optional(),
    primary: z.boolean().default(false),
    minimum: z.number().min(0).default(0),
    multiplier: z.number().min(0).max(10).default(1.0)
  })).optional(),
  
  // Pagination
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0)
};

/**
 * Auth API Schemas
 */
const authSchemas = {
  // POST /api/auth/register
  register: z.object({
    email: commonFields.email,
    password: commonFields.password,
    name: commonFields.name,
    phone: commonFields.phone.optional()
  }),
  
  // POST /api/auth/login
  login: z.object({
    email: commonFields.email,
    password: z.string().min(1, 'Password is required')
  }),
  
  // POST /api/auth/request-password-reset
  requestPasswordReset: z.object({
    email: commonFields.email
  }),
  
  // POST /api/auth/reset-password
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: commonFields.password
  }),
  
  // GET /api/auth/check-email
  checkEmail: z.object({
    email: commonFields.email
  })
};

/**
 * Tenant API Schemas
 */
const tenantSchemas = {
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
 * Payment API Schemas
 */
const paymentSchemas = {
  // POST /api/payments/create-intent
  createIntent: z.object({
    amount: z.number().int().min(100, 'Amount must be at least $1.00').max(99999999, 'Amount too large'),
    currency: z.string().length(3).default('usd'),
    customerEmail: commonFields.email,
    businessName: commonFields.businessName,
    planType: z.enum(['basic', 'premium', 'enterprise']),
    metadata: commonFields.metadata
  }),
  
  // POST /api/payments/confirm
  confirm: z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    tenantData: tenantSchemas.signup
  })
};

/**
 * Service Areas API Schemas
 */
const serviceAreaSchemas = {
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

/**
 * Website Content API Schemas
 */
const websiteContentSchemas = {
  // PUT /api/website-content/:slug
  update: z.object({
    hero_title: z.string().max(255).optional(),
    hero_subtitle: z.string().max(500).optional(),
    services_title: z.string().max(255).optional(),
    services_subtitle: z.string().max(500).optional(),
    services_auto_description: z.string().max(2000).optional(),
    services_marine_description: z.string().max(2000).optional(),
    services_rv_description: z.string().max(2000).optional(),
    services_ceramic_description: z.string().max(2000).optional(),
    services_correction_description: z.string().max(2000).optional(),
    services_ppf_description: z.string().max(2000).optional(),
    reviews_title: z.string().max(255).optional(),
    reviews_subtitle: z.string().max(500).optional(),
    reviews_avg_rating: z.number().min(0).max(5).optional(),
    reviews_total_count: z.number().int().min(0).optional(),
    faq_title: z.string().max(255).optional(),
    faq_subtitle: z.string().max(500).optional(),
    faq_items: z.array(z.object({
      question: z.string().max(500),
      answer: z.string().max(2000)
    })).optional()
  })
};

/**
 * Review API Schemas
 */
const reviewSchemas = {
  // POST /api/reviews
  create: z.object({
    tenant_slug: commonFields.slug.optional(),
    customer_name: commonFields.name,
    rating: commonFields.rating,
    comment: z.string().max(2000).optional(),
    reviewer_url: commonFields.url.optional(),
    vehicle_type: z.string().max(100).optional(),
    paint_correction: z.boolean().optional(),
    ceramic_coating: z.boolean().optional(),
    paint_protection_film: z.boolean().optional(),
    source: z.enum(['google', 'facebook', 'yelp', 'direct', 'other']).optional(),
    avatar_filename: z.string().max(255).optional()
  }),
  
  // GET /api/reviews
  list: z.object({
    tenant_slug: commonFields.slug.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0)
  })
};

/**
 * Schedule API Schemas
 */
const scheduleSchemas = {
  // POST /api/schedule/appointments
  createAppointment: z.object({
    title: z.string().min(1).max(255),
    service_type: z.string().min(1).max(100),
    service_duration: z.number().int().min(30).max(480), // 30 minutes to 8 hours
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    customer_name: commonFields.name,
    customer_phone: commonFields.phone,
    customer_email: commonFields.email.optional(),
    notes: z.string().max(1000).optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('scheduled')
  }),
  
  // PUT /api/schedule/appointments/:id
  updateAppointment: z.object({
    title: z.string().min(1).max(255).optional(),
    service_type: z.string().min(1).max(100).optional(),
    service_duration: z.number().int().min(30).max(480).optional(),
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    customer_name: commonFields.name.optional(),
    customer_phone: commonFields.phone.optional(),
    customer_email: commonFields.email.optional(),
    notes: z.string().max(1000).optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional()
  }),
  
  // POST /api/schedule/block-dates
  blockDate: z.object({
    date: commonFields.dateString,
    reason: z.string().max(255).optional(),
    all_day: z.boolean().default(true),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional()
  })
};

/**
 * Analytics API Schemas
 */
const analyticsSchemas = {
  // POST /api/analytics/track
  track: z.object({
    event: z.string().min(1).max(100),
    parameters: z.record(z.any()).optional(),
    userProperties: z.record(z.any()).optional(),
    customDimensions: z.record(z.any()).optional(),
    timestamp: z.string().datetime().optional()
  }),
  
  // GET /api/analytics/events/:tenantId
  getEvents: z.object({
    tenantId: z.string().uuid(),
    limit: commonFields.limit,
    offset: commonFields.offset,
    eventType: z.string().max(100).optional()
  }),
  
  // GET /api/analytics/summary/:tenantId
  getSummary: z.object({
    tenantId: z.string().uuid(),
    days: z.number().int().min(1).max(365).default(30)
  })
};

/**
 * Services API Schemas
 */
const serviceSchemas = {
  // POST /api/services - Create a service
  create: z.object({
    tenant_id: z.number().int().positive(),
    vehicle_id: z.union([z.string(), z.number().int().positive()]), // Can be string or number
    service_category_id: z.number().int().min(1).max(7),
    name: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    base_price_cents: z.number().int().min(0).optional(),
    tiers: z.array(z.object({
      name: z.string().min(1).max(255),
      price: z.number().min(0),
      duration: z.number().int().min(1).optional(),
      features: z.array(z.string()).optional(),
      popular: z.boolean().optional(),
      tierCopies: z.any().optional() // For backwards compatibility
    })).optional()
  }),
  
  // PUT /api/services/:serviceId - Update a service
  update: z.object({
    tenant_id: z.number().int().positive(),
    vehicle_id: z.union([z.string(), z.number().int().positive()]),
    service_category_id: z.number().int().min(1).max(7),
    name: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    base_price_cents: z.number().int().min(0).optional(),
    tiers: z.array(z.object({
      name: z.string().min(1).max(255),
      price: z.number().min(0),
      duration: z.number().int().min(1).optional(),
      features: z.array(z.string()).optional(),
      popular: z.boolean().optional(),
      tierCopies: z.any().optional()
    })).optional()
  }),
  
  // DELETE /api/services/:serviceId - Delete a service
  deleteParams: z.object({
    serviceId: z.string().regex(/^\d+$/, 'Service ID must be a number')
  }),
  
  // GET /api/services/tenant/:tenantId/vehicle/:vehicleId/category/:categoryId
  getParams: z.object({
    tenantId: z.string().regex(/^\d+$/, 'Tenant ID must be a number'),
    vehicleId: z.union([z.string(), z.string().regex(/^\d+$/, 'Vehicle ID must be a number')]),
    categoryId: z.string().regex(/^[1-7]$/, 'Category ID must be between 1 and 7')
  })
};

/**
 * Error Tracking API Schemas
 */
const errorTrackingSchemas = {
  // POST /api/errors/track
  track: z.object({
    errors: z.array(z.object({
      message: z.string(),
      code: z.string().optional(),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).optional(),
      category: z.string().optional(),
      tenantId: z.union([z.string(), z.number()]).optional(),
      userId: z.union([z.string(), z.number()]).optional(),
      correlationId: z.string().optional(),
      sessionId: z.string().optional(),
      userAgent: z.string().optional(),
      url: z.string().optional(),
      stack: z.string().optional(),
      componentStack: z.string().optional(),
      metadata: z.record(z.any()).optional()
    })),
    sessionId: z.string().optional(),
    timestamp: z.string().optional()
  })
};

/**
 * Tenant Images API Schemas
 */
const tenantImagesSchemas = {
  // POST /api/tenant-images/upload
  upload: z.object({
    tenant: z.string().min(1, 'Tenant is required'),
    category: z.string().default('gallery').optional()
  })
};

/**
 * Domain Management API Schemas
 */
const domainSchemas = {
  // PUT /api/domains/:tenantId
  setDomain: z.object({
    customDomain: z.string().min(3).max(255).regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i,
      'Invalid domain format'
    )
  }),
  
  // Params validation
  tenantIdParam: z.object({
    tenantId: z.string().regex(/^\d+$/, 'Tenant ID must be a number')
  }),
  
  domainParam: z.object({
    domain: z.string().min(3).max(255)
  })
};

/**
 * Admin API Schemas
 */
const adminSchemas = {
  // DELETE /api/admin/tenants/:id
  deleteTenant: z.object({
    id: z.string().regex(/^\d+$/, 'Tenant ID must be a number')
  }),
  
  // POST /api/admin/approve-application/:id
  approveApplication: z.object({
    id: z.string().regex(/^\d+$/, 'Application ID must be a number'),
    approved_slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').refine(
      (slug) => !slug.startsWith('-') && !slug.endsWith('-') && !slug.includes('--'),
      'Slug cannot start/end with hyphens or contain consecutive hyphens'
    ),
    admin_notes: z.string().max(1000).optional()
  }),
  
  // POST /api/admin/reject-application/:id
  rejectApplication: z.object({
    id: z.string().regex(/^\d+$/, 'Application ID must be a number'),
    rejection_reason: z.string().min(10).max(500),
    admin_notes: z.string().max(1000).optional()
  }),
  
  // GET /api/admin/users
  getUsers: z.object({
    status: z.enum(['admin', 'tenant', 'customer', 'all-users']).optional(),
    slug: commonFields.slug.optional(),
    limit: commonFields.limit,
    offset: commonFields.offset
  }),
  
  // POST /api/admin/users/:id/roles
  updateUserRoles: z.object({
    id: z.string().regex(/^\d+$/, 'User ID must be a number'),
    roles: z.array(z.string()).min(1)
  }),
  
  // DELETE /api/admin/users/:id
  deleteUser: z.object({
    id: z.string().regex(/^\d+$/, 'User ID must be a number')
  })
};

/**
 * Export all schemas
 */
export {
  commonFields,
  authSchemas,
  tenantSchemas,
  paymentSchemas,
  serviceAreaSchemas,
  websiteContentSchemas,
  reviewSchemas,
  scheduleSchemas,
  analyticsSchemas,
  adminSchemas,
  serviceSchemas,
  errorTrackingSchemas,
  tenantImagesSchemas,
  domainSchemas
};
