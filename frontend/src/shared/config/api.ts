// API configuration - always use relative URLs to leverage Vite proxy
// In production, same domain, so relative works
// In development, Vite proxy handles /api -> http://localhost:3001

export const API_BASE_URL = ''; // Always use relative URLs

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  HEALTH: '/api/health',
} as const;
