/**
 * Unified Environment Configuration
 * - Non-blocking validation with Zod
 * - Never crashes the server on missing vars
 * - Works in both dev and production
 */

import 'dotenv/config';

import { z } from 'zod';

/** Schema definition */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),

  DATABASE_URL: z.string().url().optional(),
  
  BASE_DOMAIN: z.string().default('thatsmartsite.com'),

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

    // SECURITY: In production, critical secrets MUST be present
    if (env.NODE_ENV === 'production') {
      const missingSecrets = [];
      
      if (!env.JWT_SECRET) {
        missingSecrets.push('JWT_SECRET');
      }
      if (!env.JWT_REFRESH_SECRET) {
        missingSecrets.push('JWT_REFRESH_SECRET');
      }
      if (!env.DATABASE_URL) {
        missingSecrets.push('DATABASE_URL');
      }
      
      if (missingSecrets.length > 0) {
        const errorMsg = `❌ CRITICAL: Missing required secrets in production: ${missingSecrets.join(', ')}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('✅ Production environment validated: All critical secrets present');
    }

    return env;
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      // In production, crash immediately if validation fails
      console.error('❌ FATAL: Environment validation failed in production');
      throw err;
    }
    // In development, just warn and continue
    console.error('❌ Failed to load environment:', err.message);
    return {}; // never crash server in dev
  }
}

// --- Synchronous export for backward compatibility ---
// This allows existing code to still use `import { env } from './env.js'`
export const env = await loadEnv();
