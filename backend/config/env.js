/**
 * Backend Environment Configuration
 * 
 * This module loads and validates all environment variables using Zod schema.
 * Import this module anywhere you need environment variables in the backend.
 * 
 * Usage:
 *   const { env } = require('./config/env');
 *   console.log(env.DATABASE_URL);
 */

// Load environment variables from .env file
import 'dotenv/config';

import { z } from 'zod';

/**
 * Environment Schema
 * Validates all required environment variables and provides defaults
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT - relaxed for development, strict for production
  JWT_SECRET: z.string().min(8).refine(
    (val) => process.env.NODE_ENV === 'production' ? val.length >= 32 : true,
    { message: "JWT_SECRET must be at least 32 characters in production" }
  ).default('dev-jwt-secret-change-in-prod'),
  
  JWT_REFRESH_SECRET: z.string().min(8).refine(
    (val) => process.env.NODE_ENV === 'production' ? val.length >= 32 : true,
    { message: "JWT_REFRESH_SECRET must be at least 32 characters in production" }
  ).default('dev-jwt-refresh-secret-change-in-prod'),
  
  // CORS - parse comma-separated origins
  ALLOWED_ORIGINS: z.string().optional().transform((val) => {
    if (!val) {return ['http://localhost:5173', 'http://localhost:3000'];}
    return val.split(',').map(origin => origin.trim());
  }),
  
  // Admin
  ADMIN_EMAILS: z.string().optional().transform((val) => {
    if (!val) {return [];}
    return val.split(',').map(email => email.trim());
  }),
  ADMIN_PASSWORD: z.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Email Service (SendGrid)
  SENDGRID_API_KEY: z.string().startsWith('SG.').optional(),
  FROM_EMAIL: z.string().email().default('hello@thatsmartsite.com'),
  
  // Frontend URL for redirects
  FRONTEND_URL: z.string().url().optional().default('https://thatsmartsite.com'),
  
  // Google OAuth (shared across all Google services)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).optional().default('info'),
  LOG_FILE: z.string().optional(),
});

/**
 * Parse and validate environment variables
 * Will throw an error if validation fails
 */
let env;
try {
  env = EnvSchema.parse(process.env);
  
  // Additional validation for Google OAuth (only warn, don't fail)
  const missingGoogle = [];
  if (!env.GOOGLE_CLIENT_ID) missingGoogle.push('GOOGLE_CLIENT_ID');
  if (!env.GOOGLE_CLIENT_SECRET) missingGoogle.push('GOOGLE_CLIENT_SECRET');
  if (!env.GOOGLE_REDIRECT_URI) missingGoogle.push('GOOGLE_REDIRECT_URI');
  
  if (missingGoogle.length > 0) {
    console.warn('⚠️  Google OAuth environment variables missing:');
    missingGoogle.forEach((varName) => {
      console.warn(`  - ${varName}`);
    });
    console.warn('  Google services (Analytics, Reviews, etc.) will not be available until these are set.');
    console.warn('  Add them to your .env file when ready to enable Google integrations.\n');
  }
  
} catch (error) {
  console.error('❌ Environment variable validation failed:');
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  process.exit(1);
}

/**
 * Export validated environment configuration
 */
export { env };

