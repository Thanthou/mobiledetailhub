// Environment configuration
export const config = {
  // API URL - will be set based on environment
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://mobiledetailhub.onrender.com'  // Render backend URL
      : 'https://mobiledetailhub.onrender.com'  // Use Render backend for development too
    ),
  
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

// Debug logging
console.log('Environment config loaded:', {
  apiUrl: config.apiUrl,
  isProduction: config.isProduction,
  isDevelopment: config.isDevelopment,
  viteApiUrl: import.meta.env.VITE_API_URL
});
