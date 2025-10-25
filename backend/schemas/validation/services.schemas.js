/**
 * Services Validation Schemas
 * 
 * Validation rules for service management:
 * - Creating services
 * - Updating service pricing
 * - Service tiers
 * - Service categories
 */

import { z } from 'zod';

/**
 * Services API Schemas
 */
export const serviceSchemas = {
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

