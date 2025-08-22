// Environment configuration
export const config = {
  // API URL - will be set based on environment
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://mobiledetailhub.onrender.com'  // Render backend URL
      : ''  // Empty string for development to use relative URLs with Vite proxy
    ),
  
  // API URLs for admin dashboard toggle
  apiUrls: {
    local: import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001',
    live: import.meta.env.VITE_API_URL_LIVE || 'https://mobiledetailhub.onrender.com'
  },
  
  // Environment
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  
  // Business domains
  domains: {
    jps: 'mobiledetailhub.com/jps',
    abc: 'mobiledetailhub.com/abc',
    mdh: 'mobiledetailhub.com'
  }
};

// Debug logging removed for production
