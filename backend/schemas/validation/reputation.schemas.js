/**
 * Reputation/Review Validation Schemas
 * 
 * Validation rules for review management:
 * - Creating reviews
 * - Listing reviews
 * - Review moderation
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Review API Schemas
 */
export const reviewSchemas = {
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

