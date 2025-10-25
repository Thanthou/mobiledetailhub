/**
 * Admin Validation Schemas
 * 
 * Validation rules for admin operations:
 * - Tenant approval/rejection
 * - User management
 * - System administration
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Admin API Schemas
 */
export const adminSchemas = {
  // DELETE /api/admin/tenants/:id
  deleteTenant: z.object({
    id: z.string().regex(/^\d+$/, 'Tenant ID must be a number')
  }),
  
  // POST /api/admin/approve-application/:id
  approveApplication: z.object({
    id: z.string().regex(/^\d+$/, 'Application ID must be a number'),
    approved_slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').refine(
      (slug) => !slug.startsWith('-') && !slug.endsWith('-') && !slug.includes('--'),
      'Slug cannot start/end with hyphens or contain consecutive hyphens'
    ),
    admin_notes: z.string().max(1000).optional()
  }),
  
  // POST /api/admin/reject-application/:id
  rejectApplication: z.object({
    id: z.string().regex(/^\d+$/, 'Application ID must be a number'),
    rejection_reason: z.string().min(10).max(500),
    admin_notes: z.string().max(1000).optional()
  }),
  
  // GET /api/admin/users
  getUsers: z.object({
    status: z.enum(['admin', 'tenant', 'customer', 'all-users']).optional(),
    slug: commonFields.slug.optional(),
    limit: commonFields.limit,
    offset: commonFields.offset
  }),
  
  // POST /api/admin/users/:id/roles
  updateUserRoles: z.object({
    id: z.string().regex(/^\d+$/, 'User ID must be a number'),
    roles: z.array(z.string()).min(1)
  }),
  
  // DELETE /api/admin/users/:id
  deleteUser: z.object({
    id: z.string().regex(/^\d+$/, 'User ID must be a number')
  })
};

