/**
 * Async-safe environment loader
 * - Non-blocking validation
 * - Warns instead of exiting on failure
 * - Compatible with Render deployment
 */

import 'dotenv/config';
import { z } from 'zod';

/** Schema definition */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),

  DATABASE_URL: z.string().url().optional(),

  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),

  ALLOWED_ORIGINS: z.string().optional().transform(val =>
    val ? val.split(',').map(v => v.trim()) : ['http://localhost:5173', 'http://localhost:3000']
  ),

  ADMIN_EMAILS: z.string().optional().transform(val =>
    val ? val.split(',').map(v => v.trim()) : []
  ),
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
 * Validate environment asynchronously.
 * Returns a resolved object even if some fields are invalid.
 */
export async function loadEnv() {
  try {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
      console.warn('⚠️  Environment variable warnings:');
      parsed.error.errors.forEach(e =>
        console.warn(`  - ${e.path.join('.')}: ${e.message}`)
      );
    }

    const env = parsed.success ? parsed.data : EnvSchema.parse({});
    if (!env.DATABASE_URL) {
      console.warn('⚠️  DATABASE_URL not provided — DB connection will be lazy.');
    }

    return env;
  } catch (err) {
    console.error('❌ Failed to load environment:', err.message);
    return {}; // never crash server
  }
}
