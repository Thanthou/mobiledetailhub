/**
 * Async-safe environment loader (Render-compatible)
 * -------------------------------------------------
 * - Non-blocking validation with Zod
 * - Never crashes the server on missing vars
 * - Works in both dev and production
 */

import 'dotenv/config';
import { createModuleLogger } from '../config/logger.js';
const logger = createModuleLogger('env');


import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),

  DATABASE_URL: z.string().url().optional(),
  
  BASE_DOMAIN: z.string().default('thatsmartsite.com'),

  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),

  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform(v =>
      v ? v.split(',').map(s => s.trim()) : ['http://localhost:5173', 'http://localhost:3000']
    ),

  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform(v => (v ? v.split(',').map(s => s.trim()) : [])),

  ADMIN_PASSWORD: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().default('hello@thatsmartsite.com'),

  FRONTEND_URL: z.string().optional().default('https://thatsmartsite.com'),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().optional()
});

/**
 * Loads and validates process.env asynchronously.
 * Always resolves — never terminates the process.
 */
export async function loadEnv() {
  try {
    const parsed = EnvSchema.safeParse(process.env);

    if (!parsed.success) {
      logger.warn('⚠️  Environment variable issues detected:');
      parsed.error.errors.forEach(e =>
        logger.warn(`  - ${e.path.join('.')}: ${e.message}`)
      );
    }

    const env = parsed.success ? parsed.data : EnvSchema.parse({});
    if (!env.DATABASE_URL) logger.warn('⚠️  DATABASE_URL not provided (DB disabled)');

    return env;
  } catch (err) {
    logger.error('❌ Failed to load env:', err.message);
    return {}; // Never crash
  }
}

// --- Compatibility export for legacy imports ---
// This allows existing code to still use `import { env } from './env.js'`
export const env = await loadEnv();