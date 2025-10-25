/**
 * Common Field Validators
 * 
 * Shared Zod validators for reusable field types across all schemas.
 * These represent standard validation rules for common data types.
 */

import { z } from 'zod';

/**
 * Common field schemas for reuse across all validation schemas
 */
export const commonFields = {
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

