/**
 * Image Management Validation Schemas
 * 
 * Validation rules for image uploads and management:
 * - Tenant images
 * - Gallery images
 * - Avatar uploads
 */

import { z } from 'zod';

/**
 * Tenant Images API Schemas
 */
export const tenantImagesSchemas = {
  // POST /api/tenant-images/upload
  upload: z.object({
    tenant: z.string().min(1, 'Tenant is required'),
    category: z.string().default('gallery').optional()
  })
};

