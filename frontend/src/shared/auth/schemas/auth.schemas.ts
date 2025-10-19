import { z } from 'zod';

// Base user schema
export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  is_admin: z.boolean().default(false),
  tenant_id: z.number().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

// Login request schema
export const loginRequestSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Registration request schema
export const registerRequestSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  phone: z.string()
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .optional(),
});

// Refresh token request schema
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Logout request schema
export const logoutRequestSchema = z.object({
  deviceId: z.string().optional(),
});

// Auth response schema
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Error response schema
export const authErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  retryAfterSeconds: z.number().optional(),
  remainingAttempts: z.number().optional(),
  resetTime: z.string().optional(),
});

// Rate limit info schema
export const rateLimitInfoSchema = z.object({
  retryAfterSeconds: z.number(),
  remainingAttempts: z.number().optional(),
  resetTime: z.string().optional(),
});

// Session schema
export const sessionSchema = z.object({
  id: z.string(),
  deviceId: z.string(),
  ipAddress: z.string(),
  userAgent: z.string(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime(),
  isActive: z.boolean(),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type LogoutRequest = z.infer<typeof logoutRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema>;
export type RateLimitInfo = z.infer<typeof rateLimitInfoSchema>;
export type Session = z.infer<typeof sessionSchema>;

// Validation functions
export const validateLoginRequest = (data: unknown) => loginRequestSchema.parse(data);
export const validateRegisterRequest = (data: unknown) => registerRequestSchema.parse(data);
export const validateRefreshTokenRequest = (data: unknown) => refreshTokenRequestSchema.parse(data);
export const validateLogoutRequest = (data: unknown) => logoutRequestSchema.parse(data);
