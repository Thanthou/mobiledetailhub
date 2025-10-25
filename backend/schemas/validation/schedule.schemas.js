/**
 * Schedule Validation Schemas
 * 
 * Validation rules for appointment scheduling:
 * - Creating appointments
 * - Updating appointments
 * - Blocking dates
 * - Schedule settings
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Schedule API Schemas
 */
export const scheduleSchemas = {
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

