/**
 * Domain Management Validation Schemas
 * 
 * Validation rules for custom domain management:
 * - Setting custom domains
 * - Domain verification
 * - DNS configuration
 */

import { z } from 'zod';

/**
 * Domain Management API Schemas
 */
export const domainSchemas = {
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

