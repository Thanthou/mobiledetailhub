/**
 * Auth Validation Schemas
 * 
 * Validation rules for authentication endpoints:
 * - User registration
 * - Login
 * - Password reset
 * - Email verification
 */

import { z } from 'zod';
import { commonFields } from './common.js';

/**
 * Auth API Schemas
 */
export const authSchemas = {
  // POST /api/auth/register
  register: z.object({
    email: commonFields.email,
    password: commonFields.password,
    name: commonFields.name,
    phone: commonFields.phone.optional()
  }),
  
  // POST /api/auth/login
  login: z.object({
    email: commonFields.email,
    password: z.string().min(1, 'Password is required')
  }),
  
  // POST /api/auth/request-password-reset
  requestPasswordReset: z.object({
    email: commonFields.email
  }),
  
  // POST /api/auth/reset-password
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: commonFields.password
  }),
  
  // GET /api/auth/check-email
  checkEmail: z.object({
    email: commonFields.email
  })
};

