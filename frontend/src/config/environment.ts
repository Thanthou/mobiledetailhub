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
    jps: 'jps.mobiledetailhub.com',
    abc: 'abc.mobiledetailhub.com',
    mdh: 'mobiledetailhub.com'
  }
};
