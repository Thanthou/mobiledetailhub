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
require('dotenv').config();

const { z } = require('zod');

/**
 * Environment Schema
 * Validates all required environment variables and provides defaults
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  
  // CORS - parse comma-separated origins
  ALLOWED_ORIGINS: z.string().optional().transform((val) => {
    if (!val) return ['http://localhost:5173', 'http://localhost:3000'];
    return val.split(',').map(origin => origin.trim());
  }),
  
  // Admin
  ADMIN_EMAILS: z.string().optional().transform((val) => {
    if (!val) return [];
    return val.split(',').map(email => email.trim());
  }),
  ADMIN_PASSWORD: z.string().optional(),
  
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
module.exports = { env };

