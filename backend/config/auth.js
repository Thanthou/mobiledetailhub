/**
 * Centralized JWT/Auth configuration
 */

const { env } = require('./env');

const AUTH_CONFIG = {
  ISSUER: 'mdh-backend',
  AUDIENCE: 'mdh-users',
  ACCESS_EXPIRES_IN: '15m',
  REFRESH_EXPIRES_IN: '7d',
  REFRESH_COOKIE_NAME: 'refresh_token',
  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  },
};

module.exports = { AUTH_CONFIG };


