/**
 * Input Validation Utilities
 * Provides common validation functions for API endpoints
 */

const logger = require('./logger');

/**
 * Common validation patterns
 */
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?1?\d{10,15}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  STATE_CODE: /^[A-Z]{2}$/,
  SLUG: /^[a-z0-9-]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  ALPHABETIC: /^[a-zA-Z\s]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/
};

/**
 * Validation error class
 */
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Base validation functions
 */
const validators = {
  /**
   * Check if value exists and is not empty
   */
  required: (value, fieldName) => {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid email
   */
  email: (value, fieldName) => {
    if (value && !PATTERNS.EMAIL.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid email address`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid phone number
   */
  phone: (value, fieldName) => {
    if (value && !PATTERNS.PHONE.test(value.replace(/\D/g, ''))) {
      throw new ValidationError(`${fieldName} must be a valid phone number`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid zip code
   */
  zipCode: (value, fieldName) => {
    if (value && !PATTERNS.ZIP_CODE.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid zip code`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid state code
   */
  stateCode: (value, fieldName) => {
    if (value && !PATTERNS.STATE_CODE.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid 2-letter state code`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid slug
   */
  slug: (value, fieldName) => {
    if (value && !PATTERNS.SLUG.test(value)) {
      throw new ValidationError(`${fieldName} must contain only lowercase letters, numbers, and hyphens`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid URL
   */
  url: (value, fieldName) => {
    if (value && !PATTERNS.URL.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid URL`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is alphanumeric
   */
  alphanumeric: (value, fieldName) => {
    if (value && !PATTERNS.ALPHANUMERIC.test(value)) {
      throw new ValidationError(`${fieldName} must contain only letters, numbers, and spaces`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is alphabetic only
   */
  alphabetic: (value, fieldName) => {
    if (value && !PATTERNS.ALPHABETIC.test(value)) {
      throw new ValidationError(`${fieldName} must contain only letters and spaces`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is numeric
   */
  numeric: (value, fieldName) => {
    if (value && !PATTERNS.NUMERIC.test(value.toString())) {
      throw new ValidationError(`${fieldName} must be a number`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a decimal number
   */
  decimal: (value, fieldName) => {
    if (value && !PATTERNS.DECIMAL.test(value.toString())) {
      throw new ValidationError(`${fieldName} must be a valid decimal number`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value length is within range
   */
  length: (value, fieldName, min, max) => {
    if (value) {
      const len = value.toString().length;
      if (min !== undefined && len < min) {
        throw new ValidationError(`${fieldName} must be at least ${min} characters long`, fieldName, value);
      }
      if (max !== undefined && len > max) {
        throw new ValidationError(`${fieldName} must be no more than ${max} characters long`, fieldName, value);
      }
    }
    return true;
  },

  /**
   * Check if value is within range
   */
  range: (min, max) => {
    return (value, fieldName) => {
      if (value !== undefined && value !== null) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          throw new ValidationError(`${fieldName} must be a number`, fieldName, value);
        }
        if (min !== undefined && num < min) {
          throw new ValidationError(`${fieldName} must be at least ${min}`, fieldName, value);
        }
        if (max !== undefined && num > max) {
          throw new ValidationError(`${fieldName} must be no more than ${max}`, fieldName, value);
        }
      }
      return true;
    };
  },

  /**
   * Check if value is one of the allowed values
   */
  enum: (allowedValues) => {
    return (value, fieldName) => {
      if (value && !allowedValues.includes(value)) {
        throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`, fieldName, value);
      }
      return true;
    };
  },

  /**
   * Check if value is a valid boolean
   */
  boolean: (value, fieldName) => {
    if (value !== undefined && value !== null && typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      throw new ValidationError(`${fieldName} must be a boolean value`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid date
   */
  date: (value, fieldName) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new ValidationError(`${fieldName} must be a valid date`, fieldName, value);
      }
    }
    return true;
  },

  /**
   * Check if value is a valid array
   */
  array: (value, fieldName) => {
    if (value && !Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an array`, fieldName, value);
    }
    return true;
  },

  /**
   * Check if value is a valid object
   */
  object: (value, fieldName) => {
    if (value && (typeof value !== 'object' || Array.isArray(value) || value === null)) {
      throw new ValidationError(`${fieldName} must be an object`, fieldName, value);
    }
    return true;
  }
};

/**
 * Sanitization functions
 */
const sanitizers = {
  /**
   * Trim whitespace from string values
   */
  trim: (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  },

  /**
   * Convert to lowercase
   */
  toLowerCase: (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  },

  /**
   * Convert to uppercase
   */
  toUpperCase: (value) => {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  },

  /**
   * Remove non-numeric characters from phone numbers
   */
  cleanPhone: (value) => {
    if (typeof value === 'string') {
      return value.replace(/\D/g, '');
    }
    return value;
  },

  /**
   * Escape HTML characters
   */
  escapeHtml: (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
    return value;
  }
};

module.exports = {
  PATTERNS,
  ValidationError,
  validators,
  sanitizers
};
