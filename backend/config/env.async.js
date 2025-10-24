/**
 * Unified Environment Configuration
 * - Non-blocking validation with Zod
 * - Never crashes the server on missing vars
 * - Works in both dev and production
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// Load .env from root directory (one level up from backend/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/** Schema definition */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).optional(),
  BACKEND_PORT: z.coerce.number().min(1000).max(65535).optional(),

  // Database connection params (individual fields - preferred method)
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().optional().default(5432),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  
  // DATABASE_URL: Optional connection string (deprecated - use individual params above)
  DATABASE_URL: z.string().optional(),
  
  BASE_DOMAIN: z.string().default('thatsmartsite.com'),

  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),

  ADMIN_EMAILS: z.string().optional().transform(val =>
    val ? val.split(',').map(v => v.trim()) : []
  ),
  ADMIN_EMAIL: z.string().optional(), // Support singular form for backward compatibility
  ADMIN_PASSWORD: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().default('hello@thatsmartsite.com'),

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

    // SECURITY: In production, critical secrets MUST be present
    if (env.NODE_ENV === 'production') {
      const missingSecrets = [];
      
      if (!env.JWT_SECRET) {
        missingSecrets.push('JWT_SECRET');
      }
      if (!env.JWT_REFRESH_SECRET) {
        missingSecrets.push('JWT_REFRESH_SECRET');
      }
      if (!env.DB_HOST || !env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD) {
        missingSecrets.push('DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
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
