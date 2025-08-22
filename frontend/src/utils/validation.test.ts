/**
 * Tests for validation utility functions
 */

import { 
  validateEmail, 
  validatePhone, 
  validateName, 
  validatePassword,
  validateVehicleField,
  validateService,
  validateMessage,
  sanitizeText,
  sanitizeHtml
} from './validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'test@example.com'
      });
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toEqual({
        isValid: false,
        errors: ['Email format is invalid']
      });
    });

    it('should reject empty emails', () => {
      expect(validateEmail('')).toEqual({
        isValid: false,
        errors: ['Email is required']
      });
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('(555) 123-4567')).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: '(555) 123-4567'
      });
    });

    it('should reject phone numbers with too few digits', () => {
      expect(validatePhone('123')).toEqual({
        isValid: false,
        errors: ['Phone number must have at least 10 digits']
      });
    });
  });

  describe('validateName', () => {
    it('should validate correct names', () => {
      expect(validateName('John Doe')).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'John Doe'
      });
    });

    it('should reject names that are too short', () => {
      expect(validateName('J')).toEqual({
        isValid: false,
        errors: ['Name must be at least 2 characters']
      });
    });

    it('should reject names with invalid characters', () => {
      expect(validateName('John123')).toEqual({
        isValid: false,
        errors: ['Name format is invalid']
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate login passwords (any non-empty)', () => {
      expect(validatePassword('password', true)).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'password'
      });
    });

    it('should enforce strong password requirements for registration', () => {
      expect(validatePassword('weak', false)).toEqual({
        isValid: false,
        errors: ['Password must be at least 8 characters', 'Password must contain at least one uppercase letter', 'Password must contain at least one number', 'Password must contain at least one special character']
      });
    });

    it('should accept strong passwords', () => {
      expect(validatePassword('StrongPass123!', false)).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'StrongPass123!'
      });
    });
  });

  describe('validateVehicleField', () => {
    it('should validate vehicle make/model', () => {
      expect(validateVehicleField('Toyota', 'Vehicle make')).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'Toyota'
      });
    });

    it('should reject vehicle fields that are too short', () => {
      expect(validateVehicleField('T', 'Vehicle make')).toEqual({
        isValid: false,
        errors: ['Vehicle make must be at least 2 characters']
      });
    });
  });

  describe('validateService', () => {
    it('should validate service selection', () => {
      expect(validateService('Detail')).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'Detail'
      });
    });

    it('should reject empty service', () => {
      expect(validateService('')).toEqual({
        isValid: false,
        errors: ['Service is required']
      });
    });
  });

  describe('validateMessage', () => {
    it('should validate optional message', () => {
      expect(validateMessage('', false)).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: ''
      });
    });

    it('should validate non-empty message', () => {
      expect(validateMessage('Test message', false)).toEqual({
        isValid: true,
        errors: [],
        sanitizedValue: 'Test message'
      });
    });

    it('should reject messages that are too long', () => {
      const longMessage = 'a'.repeat(1001);
      expect(validateMessage(longMessage, false)).toEqual({
        isValid: false,
        errors: ['Message must be no more than 1000 characters']
      });
    });
  });

  describe('sanitizeText', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript protocol', () => {
      expect(sanitizeText('javascript:alert("xss")')).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      expect(sanitizeText('onclick="alert(1)"')).toBe('="alert(1)"');
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;/div&gt;');
    });

    it('should escape quotes', () => {
      expect(sanitizeHtml('"Hello"')).toBe('&quot;Hello&quot;');
    });
  });
});
