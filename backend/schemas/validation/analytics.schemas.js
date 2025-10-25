/**
 * Analytics Validation Schemas
 * 
 * Validation rules for analytics tracking:
 * - Event tracking
 * - Custom dimensions
 * - Analytics queries
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Analytics API Schemas
 */
export const analyticsSchemas = {
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

