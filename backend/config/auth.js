/**
 * Centralized JWT/Auth configuration
 */

import { env } from './env.js';

const AUTH_CONFIG = {
  ISSUER: 'thatsmartsite-backend',
  AUDIENCE: 'thatsmartsite-users',
  ACCESS_EXPIRES_IN: '15m',  // 15 minutes - short-lived for security
  REFRESH_EXPIRES_IN: '30d', // 30 days - long-lived refresh tokens
  REFRESH_COOKIE_NAME: 'refresh_token',
  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
  },
  getAccessCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    };
  },
};

export { AUTH_CONFIG };


