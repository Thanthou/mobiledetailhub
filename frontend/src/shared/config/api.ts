// API configuration based on environment
const getApiBaseUrl = () => {
  // In production, use relative URLs (same domain)
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use localhost
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;
