/**
 * Environment Variable Validator
 * Validates that all required environment variables are present on startup
 * Enforces strong secret policies and blocks weak defaults in production
 */

import logger from './logger.js';

const requiredEnvVars = {
  // Database Configuration
  DB_HOST: 'Database host (e.g., localhost)',
  DB_PORT: 'Database port (e.g., 5432)',
  DB_NAME: 'Database name',
  DB_USER: 'Database username',
  DB_PASSWORD: 'Database password',
  
  // JWT Configuration
  JWT_SECRET: 'JWT secret key for authentication',
  JWT_REFRESH_SECRET: 'JWT refresh token secret key for enhanced security',
  
  // Server Configuration
  PORT: 'Server port (optional, defaults to 3001)',
  
  // Admin Configuration
  ADMIN_PASSWORD: 'Admin password (required for production)',
  
  // Optional Configuration
  NODE_ENV: 'Node environment (optional, defaults to development)',
  DATABASE_URL: 'Full database URL (optional, alternative to individual DB_* vars)',
  ALLOWED_ORIGINS: 'Allowed origins for CORS (e.g., http://localhost:3000, https://api.example.com)'
};

const optionalEnvVars = {
  NODE_ENV: 'development',
  PORT: '3001'
};

// Weak secret patterns to detect and block
const WEAK_SECRET_PATTERNS = [
  /^admin123$/i,
  /^password$/i,
  /^secret$/i,
  /^123456$/,
  /^qwerty$/i,
  /^letmein$/i,
  /^welcome$/i,
  /^changeme$/i,
  /^default$/i,
  /^test$/i,
  /^demo$/i,
  /^temp$/i,
  /^temp123$/i,
  /^admin$/i,
  /^root$/i,
  /^user$/i,
  /^guest$/i,
  /^public$/i,
  /^private$/i,
  /^internal$/i
];

/**
 * Calculates entropy of a string to measure randomness
 * @param {string} str - String to calculate entropy for
 * @returns {number} Entropy value (higher = more random)
 */
function calculateEntropy(str) {
  const charCount = {};
  for (const char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = str.length;
  
  for (const count of Object.values(charCount)) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
}

/**
 * Validates JWT secret strength
 * @param {string} secret - Secret to validate
 * @param {string} secretName - Name of the secret for error messages
 * @returns {Object} Validation result with isValid and messages
 */
function validateJwtSecret(secret, secretName) {
  const issues = [];
  let isValid = true;
  
  // Check minimum length (32 characters)
  if (secret.length < 32) {
    issues.push(`${secretName} must be at least 32 characters long (current: ${secret.length})`);
    isValid = false;
  }
  
  // Check for weak patterns
  for (const pattern of WEAK_SECRET_PATTERNS) {
    if (pattern.test(secret)) {
      issues.push(`${secretName} contains weak/guessable pattern: ${pattern.source}`);
      isValid = false;
      break;
    }
  }
  
  // Check entropy (should be at least 3.5 for strong secrets)
  const entropy = calculateEntropy(secret);
  if (entropy < 3.5) {
    issues.push(`${secretName} has low entropy (${entropy.toFixed(2)}), should be ≥3.5 for strong secrets`);
    isValid = false;
  }
  
  // Check for repeated characters (more than 50% same character)
  const charCount = {};
  for (const char of secret) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  const maxCharCount = Math.max(...Object.values(charCount));
  if (maxCharCount > secret.length * 0.5) {
    issues.push(`${secretName} has too many repeated characters (${maxCharCount}/${secret.length})`);
    isValid = false;
  }
  
  return { isValid, issues };
}

/**
 * Validates admin password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and messages
 */
function validateAdminPassword(password) {
  const issues = [];
  let isValid = true;
  
  // Check minimum length (12 characters for admin)
  if (password.length < 12) {
    issues.push('ADMIN_PASSWORD must be at least 12 characters long');
    isValid = false;
  }
  
  // Check for weak patterns
  for (const pattern of WEAK_SECRET_PATTERNS) {
    if (pattern.test(password)) {
      issues.push(`ADMIN_PASSWORD contains weak/guessable pattern: ${pattern.source}`);
      isValid = false;
      break;
    }
  }
  
  // Check entropy (should be at least 3.0 for admin passwords)
  const entropy = calculateEntropy(password);
  if (entropy < 3.0) {
    issues.push(`ADMIN_PASSWORD has low entropy (${entropy.toFixed(2)}), should be ≥3.0 for admin access`);
    isValid = false;
  }
  
  return { isValid, issues };
}

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variables are missing
 */
function validateEnvironment() {
  const missingVars = [];
  const warnings = [];
  const criticalErrors = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Validate DATABASE_URL presence and format
  const databaseUrl = process.env.DATABASE_URL;
  const hasIndividualDbVars = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME;
  
  if (!databaseUrl && !hasIndividualDbVars) {
    missingVars.push('DATABASE_URL: Either DATABASE_URL or all individual DB_* variables must be set');
  } else if (databaseUrl) {
    // Validate DATABASE_URL format
    try {
      const url = new URL(databaseUrl);
      if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
        criticalErrors.push('❌ DATABASE_URL must use postgresql:// or postgres:// protocol');
      }
      if (!url.hostname) {
        criticalErrors.push('❌ DATABASE_URL must include a hostname');
      }
      if (!url.pathname || url.pathname === '/') {
        criticalErrors.push('❌ DATABASE_URL must include a database name');
      }
    } catch (error) {
      criticalErrors.push(`❌ DATABASE_URL format is invalid: ${error.message}`);
    }
  }

  // Validate PORT
  const port = process.env.PORT || '3001';
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    criticalErrors.push(`❌ PORT must be a valid number between 1-65535, got: ${port}`);
  }

  // Production SSL validation
  if (isProduction && databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      if (url.searchParams.get('sslmode') === 'disable') {
        criticalErrors.push('❌ Production environment should not disable SSL (sslmode=disable found in DATABASE_URL)');
      }
      // Check if SSL is explicitly required but missing proper config
      if (url.protocol === 'postgres:' && !url.searchParams.has('sslmode')) {
        warnings.push('Warning: Production DATABASE_URL should specify sslmode parameter for explicit SSL configuration');
      }
    } catch {
      // URL already validated above, this shouldn't happen
    }
  }

  // Check required variables
  for (const [varName, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[varName]) {
      // Skip validation for optional variables that have defaults
      if (optionalEnvVars[varName]) {
        warnings.push(`Warning: ${varName} not set, using default: ${optionalEnvVars[varName]}`);
        continue;
      }
      
      // Skip DATABASE_URL if already validated above
      if (varName === 'DATABASE_URL') {
        continue;
      }
      
      // Skip individual DB vars if DATABASE_URL is present
      if (['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'].includes(varName) && databaseUrl) {
        continue;
      }
      
      // Skip ALLOWED_ORIGINS if not in production
      if (varName === 'ALLOWED_ORIGINS' && !isProduction) {
        warnings.push(`Warning: ${varName} not set, but not required in ${process.env.NODE_ENV || 'development'} environment`);
        continue;
      }
      
      missingVars.push(`${varName}: ${description}`);
    }
  }

  // Validate JWT secrets strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    const jwtValidation = validateJwtSecret(jwtSecret, 'JWT_SECRET');
    if (!jwtValidation.isValid) {
      if (isProduction) {
        criticalErrors.push(`❌ JWT_SECRET validation failed in production:\n  ${jwtValidation.issues.join('\n  ')}`);
      } else {
        warnings.push(`Warning: JWT_SECRET strength issues:\n  ${jwtValidation.issues.join('\n  ')}`);
      }
    }
  }

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (jwtRefreshSecret) {
    const jwtRefreshValidation = validateJwtSecret(jwtRefreshSecret, 'JWT_REFRESH_SECRET');
    if (!jwtRefreshValidation.isValid) {
      if (isProduction) {
        criticalErrors.push(`❌ JWT_REFRESH_SECRET validation failed in production:\n  ${jwtRefreshValidation.issues.join('\n  ')}`);
      } else {
        warnings.push(`Warning: JWT_REFRESH_SECRET strength issues:\n  ${jwtRefreshValidation.issues.join('\n  ')}`);
      }
    }
  }

  // Validate admin password strength
  const adminPassword = process.env.ADMIN_PASSWORD || optionalEnvVars.ADMIN_PASSWORD;
  if (adminPassword) {
    const adminValidation = validateAdminPassword(adminPassword);
    if (!adminValidation.isValid) {
      if (isProduction) {
        criticalErrors.push(`❌ ADMIN_PASSWORD validation failed in production:\n  ${adminValidation.issues.join('\n  ')}`);
      } else {
        warnings.push(`Warning: ADMIN_PASSWORD strength issues:\n  ${adminValidation.issues.join('\n  ')}`);
      }
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    logger.warn('Environment Variable Warnings:');
    warnings.forEach(warning => logger.warn(`   ${warning}`));
  }

  // Handle critical errors in production
  if (criticalErrors.length > 0) {
    logger.error('❌ Critical security validation failed in production:');
    criticalErrors.forEach(error => logger.error(`   ${error}`));
    logger.error('❌ Server startup blocked due to weak secrets in production environment');
    logger.error('❌ Please update your environment variables with strong, unique secrets');
    
    if (isProduction) {
      process.exit(1);
    }
  }

  // Throw error if required variables are missing
  if (missingVars.length > 0) {
    const errorMessage = `❌ Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file and ensure all required variables are set.`;
    throw new Error(errorMessage);
  }

  logger.info('✅ Environment variables validated successfully');
  if (isProduction) {
    logger.info('✅ Production security validation passed');
  }
}

/**
 * Gets a validated environment variable value
 * @param {string} varName - Environment variable name
 * @param {string} defaultValue - Default value if variable is not set
 * @returns {string} Environment variable value or default
 */
function getEnv(varName, defaultValue = '') {
  return process.env[varName] || defaultValue;
}

/**
 * Gets a required environment variable value
 * @param {string} varName - Environment variable name
 * @returns {string} Environment variable value
 * @throws {Error} If variable is not set
 */
function getRequiredEnv(varName) {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Required environment variable ${varName} is not set`);
  }
  return value;
}

export {
  validateEnvironment,
  getEnv,
  getRequiredEnv,
  requiredEnvVars,
  optionalEnvVars
};
