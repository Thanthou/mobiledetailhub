// Load environment variables first
require('dotenv').config();

const { z } = require('zod');

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().min(1000).max(65535).default(3001),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  
  // CORS
  ALLOWED_ORIGINS: z.string().optional(),
  
  // Admin
  ADMIN_EMAILS: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.string().optional(),
  LOG_FILE: z.string().optional(),
});

const env = EnvSchema.parse(process.env);

module.exports = { env };
