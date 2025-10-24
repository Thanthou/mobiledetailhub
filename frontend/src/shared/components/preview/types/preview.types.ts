/**
 * Preview Types
 * 
 * Type definitions and Zod schemas for preview functionality.
 */

import { z } from 'zod';

// Zod schema for preview payload validation
export const PreviewPayloadSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  phone: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  state: z
    .string()
    .length(2, 'State must be 2 characters (e.g., AZ, CA)')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase letters'),
  industry: z.enum(['mobile-detailing', 'house-cleaning', 'lawncare', 'pet-grooming'], {
    errorMap: () => ({ message: 'Invalid industry type' }),
  }),
});

// TypeScript type derived from schema
export type PreviewPayload = z.infer<typeof PreviewPayloadSchema>;

// API response types
export interface CreatePreviewResponse {
  success: boolean;
  url: string;
  token: string;
  expiresIn: string;
}

export interface VerifyPreviewResponse {
  success: boolean;
  payload: PreviewPayload;
}

export interface PreviewErrorResponse {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

