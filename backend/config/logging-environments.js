/**
 * Environment-specific logging configurations
 * Defines different logging setups for development, test, and production
 */

import { env } from './env.js';

/**
 * Development logging configuration
 */
const developmentConfig = {
  level: env.LOG_LEVEL || 'error',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
      hideObject: false
    }
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'password_hash',
      'token',
      'refreshToken',
      'accessToken',
      'apiKey',
      'secret'
    ],
    censor: '[REDACTED]'
  }
};

/**
 * Test logging configuration
 */
const testConfig = {
  level: 'error',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      translateTime: false,
      ignore: 'pid,hostname,time,level'
    }
  },
  redact: {
    paths: [
      'password',
      'password_hash',
      'token',
      'refreshToken',
      'accessToken',
      'apiKey',
      'secret'
    ],
    censor: '[REDACTED]'
  }
};

/**
 * Production logging configuration
 */
const productionConfig = {
  level: env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'password_hash',
      'token',
      'refreshToken',
      'accessToken',
      'apiKey',
      'secret',
      'email',
      'phone',
      'ssn',
      'creditCard',
      'bankAccount'
    ],
    censor: '[REDACTED]'
  },
  // In production, log to stdout (containerized) or file
  ...(env.LOG_FILE ? {
    transport: {
      target: 'pino/file',
      options: {
        destination: env.LOG_FILE
      }
    }
  } : {})
};

/**
 * Get logging configuration based on environment
 */
const getLoggingConfig = () => {
  switch (env.NODE_ENV) {
    case 'development':
      return developmentConfig;
    case 'test':
      return testConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

export {
  developmentConfig,
  testConfig,
  productionConfig,
  getLoggingConfig
};
