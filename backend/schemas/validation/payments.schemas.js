/**
 * Payment Validation Schemas
 * 
 * Validation rules for payment processing:
 * - Payment intents
 * - Payment confirmation
 * - Stripe integration
 */

import { z } from 'zod';
import { commonFields } from './common.js';
import { tenantSchemas } from './tenants.schemas.js';

/**
 * Payment API Schemas
 */
export const paymentSchemas = {
  // POST /api/payments/create-intent
  createIntent: z.object({
    amount: z.number().int().min(100, 'Amount must be at least $1.00').max(99999999, 'Amount too large'),
    currency: z.string().length(3).default('usd'),
    customerEmail: commonFields.email,
    businessName: commonFields.businessName,
    planType: z.enum(['starter', 'metro', 'pro']), // Match actual plan IDs from pricing config
    metadata: commonFields.metadata
  }),
  
  // POST /api/payments/confirm
  confirm: z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    tenantData: tenantSchemas.signup
  })
};

