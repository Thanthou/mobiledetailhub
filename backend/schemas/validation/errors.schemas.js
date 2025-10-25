/**
 * Error Tracking Validation Schemas
 * 
 * Validation rules for error tracking and monitoring:
 * - Frontend error reports
 * - Backend error logs
 * - Error categorization
 */

import { z } from 'zod';

/**
 * Error Tracking API Schemas
 */
export const errorTrackingSchemas = {
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

