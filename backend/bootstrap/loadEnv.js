// backend/bootstrap/loadEnv.js
import { loadEnv as loadEnvAsync, env } from '../config/env.async.js';

/**
 * Load and validate environment variables using the project's Zod-based validator.
 * This wraps the async loader from env.async.js for use in the bootstrap pipeline.
 */
export async function loadEnv() {
  const config = await loadEnvAsync();
  
  console.log('✅ Environment variables loaded and validated');
  console.log(`   NODE_ENV: ${config.NODE_ENV || env.NODE_ENV || 'development'}`);
  console.log(`   PORT: ${config.PORT || env.PORT || 3001}`);
  console.log(`   DB_HOST: ${config.DB_HOST || env.DB_HOST || 'not set'}`);
  
  return config;
}

// Re-export the env object for convenience
export { env };

