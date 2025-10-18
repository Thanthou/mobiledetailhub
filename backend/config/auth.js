/**
 * Centralized JWT/Auth configuration
 */

import { env } from './env.js';

const AUTH_CONFIG = {
  ISSUER: 'mdh-backend',
  AUDIENCE: 'mdh-users',
  ACCESS_EXPIRES_IN: '24h',  // 24 hours - good for admin sessions
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
};

export { AUTH_CONFIG };


