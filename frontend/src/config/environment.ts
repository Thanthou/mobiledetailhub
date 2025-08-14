// Environment configuration
export const config = {
  // API URL - will be set based on environment
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://jps-backend-api.vercel.app/api'  // Replace with your actual backend URL from Vercel
      : 'http://localhost:3001/api'
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
