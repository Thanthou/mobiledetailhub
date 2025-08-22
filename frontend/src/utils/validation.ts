/**
 * Comprehensive Input Validation and Sanitization Utility
 * Provides validation functions for common form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null; // Returns error message or null if valid
}

/**
 * Validates and sanitizes a text input field
 */
export function validateTextField(
  value: string,
  fieldName: string,
  validation: FieldValidation = {}
): ValidationResult {
  const errors: string[] = [];
  let sanitizedValue = value.trim();

  // Required validation
  if (validation.required && !sanitizedValue) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  // Skip other validations if empty and not required
  if (!sanitizedValue) {
    return { isValid: true, errors: [], sanitizedValue: '' };
  }

  // Length validations
  if (validation.minLength && sanitizedValue.length < validation.minLength) {
    errors.push(`${fieldName} must be at least ${validation.minLength} characters`);
  }

  if (validation.maxLength && sanitizedValue.length > validation.maxLength) {
    errors.push(`${fieldName} must be no more than ${validation.maxLength} characters`);
  }

  // Pattern validation
  if (validation.pattern && !validation.pattern.test(sanitizedValue)) {
    errors.push(`${fieldName} format is invalid`);
  }

  // Custom validation
  if (validation.custom) {
    const customError = validation.custom(sanitizedValue);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? sanitizedValue : undefined
  };
}

/**
 * Validates and sanitizes an email address
 */
export function validateEmail(email: string): ValidationResult {
  return validateTextField(email, 'Email', {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      // Additional email validation
      if (value.length > 254) return 'Email is too long';
      if (value.includes('..')) return 'Email contains invalid consecutive dots';
      if (value.startsWith('.') || value.endsWith('.')) return 'Email cannot start or end with a dot';
      return null;
    }
  });
}

/**
 * Validates and sanitizes a phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const digitsOnly = phone.replace(/\D/g, '');
  
  return validateTextField(phone, 'Phone number', {
    required: true,
    custom: (value) => {
      if (digitsOnly.length < 10) return 'Phone number must have at least 10 digits';
      if (digitsOnly.length > 15) return 'Phone number is too long';
      return null;
    }
  });
}

/**
 * Validates and sanitizes a name field
 */
export function validateName(name: string): ValidationResult {
  return validateTextField(name, 'Name', {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'\.]+$/,
    custom: (value) => {
      if (value.includes('  ')) return 'Name cannot contain consecutive spaces';
      if (value.startsWith(' ') || value.endsWith(' ')) return 'Name cannot start or end with spaces';
      return null;
    }
  });
}

/**
 * Validates and sanitizes a password
 */
export function validatePassword(password: string, isLogin: boolean = false): ValidationResult {
  if (isLogin) {
    // For login, just check if it's not empty
    return validateTextField(password, 'Password', { required: true });
  }

  // For registration, enforce stronger requirements
  return validateTextField(password, 'Password', {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value) => {
      const errors: string[] = [];
      
      if (!/[a-z]/.test(value)) errors.push('Password must contain at least one lowercase letter');
      if (!/[A-Z]/.test(value)) errors.push('Password must contain at least one uppercase letter');
      if (!/\d/.test(value)) errors.push('Password must contain at least one number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('Password must contain at least one special character');
      
      return errors.length > 0 ? errors.join(', ') : null;
    }
  });
}

/**
 * Validates and sanitizes a vehicle make/model
 */
export function validateVehicleField(value: string, fieldName: string): ValidationResult {
  return validateTextField(value, fieldName, {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'\.]+$/,
    custom: (value) => {
      if (value.includes('  ')) return `${fieldName} cannot contain consecutive spaces`;
      if (value.startsWith(' ') || value.endsWith(' ')) return `${fieldName} cannot start or end with spaces`;
      return null;
    }
  });
}

/**
 * Validates and sanitizes a service selection
 */
export function validateService(service: string): ValidationResult {
  return validateTextField(service, 'Service', {
    required: true,
    minLength: 2,
    maxLength: 100
  });
}

/**
 * Validates and sanitizes additional information/message
 */
export function validateMessage(message: string, required: boolean = false): ValidationResult {
  return validateTextField(message, 'Message', {
    required,
    maxLength: 1000,
    custom: (value) => {
      if (value.includes('  ')) return 'Message cannot contain consecutive spaces';
      return null;
    }
  });
}

/**
 * Sanitizes HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes text input by removing potentially dangerous characters
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validates form data object
 */
export function validateFormData(
  data: Record<string, string>,
  validations: Record<string, FieldValidation>
): { isValid: boolean; errors: Record<string, string[]>; sanitizedData: Record<string, string> } {
  const errors: Record<string, string[]> = {};
  const sanitizedData: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, validation] of Object.entries(validations)) {
    const value = data[fieldName] || '';
    const result = validateTextField(value, fieldName, validation);
    
    if (!result.isValid) {
      isValid = false;
      errors[fieldName] = result.errors;
    } else if (result.sanitizedValue !== undefined) {
      sanitizedData[fieldName] = result.sanitizedValue;
    }
  }

  return { isValid, errors, sanitizedData };
}
