import { env } from '../src/shared/env';

// Environment configuration
export const config = {
  // API URL - will be set based on environment
  apiUrl: env.VITE_API_URL || 
    (env.PROD 
      ? env.VITE_API_URL_LIVE || 'https://mobiledetailhub.onrender.com'
      : ''  // Empty string for development to use relative URLs with Vite proxy
    ),
  
  // API URLs for admin dashboard toggle
  apiUrls: {
    local: env.VITE_API_URL_LOCAL || 'http://localhost:3001',
    live: env.VITE_API_URL_LIVE || 'https://mobiledetailhub.onrender.com'
  },
  
  // Environment
  isProduction: env.PROD,
  isDevelopment: env.DEV
};

// Debug logging removed for production
