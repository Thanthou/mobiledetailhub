import { useCallback } from 'react';

import {
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  validateVehicleField
} from '@/shared/utils';

import { type QuoteFormData } from '../types';

/**
 * Hook to handle quote form validation
 * Separates validation logic from form state
 */
export const useQuoteValidation = () => {
  const validateField = useCallback((field: keyof QuoteFormData, value: string): string[] => {
    const errors: string[] = [];
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required.');
        } else {
          const nameErrors = validateName(value);
          if (nameErrors.length > 0) {
            errors.push(...nameErrors);
          }
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          errors.push('Email is required.');
        } else {
          const emailErrors = validateEmail(value);
          if (emailErrors.length > 0) {
            errors.push(...emailErrors);
          }
        }
        break;
        
      case 'phone':
        if (!value.trim()) {
          errors.push('Phone number is required.');
        } else {
          const phoneErrors = validatePhone(value);
          if (phoneErrors.length > 0) {
            errors.push(...phoneErrors);
          }
        }
        break;
        
      case 'city':
        if (!value.trim()) {
          errors.push('City is required.');
        }
        break;
        
      case 'state':
        if (!value.trim()) {
          errors.push('State is required.');
        }
        break;
        
      case 'zipCode':
        if (!value.trim()) {
          errors.push('ZIP code is required.');
        }
        break;
        
      case 'vehicleType':
        if (!value.trim()) {
          errors.push('Vehicle type is required.');
        }
        break;
        
      case 'vehicleMake':
        if (!value.trim()) {
          errors.push('Vehicle make is required.');
        }
        break;
        
      case 'vehicleModel':
        if (!value.trim()) {
          errors.push('Vehicle model is required.');
        }
        break;
        
      case 'vehicleYear':
        if (!value.trim()) {
          errors.push('Vehicle year is required.');
        } else {
          const vehicleErrors = validateVehicleField('year', value);
          if (vehicleErrors.length > 0) {
            errors.push(...vehicleErrors);
          }
        }
        break;
        
      case 'message':
        if (value.trim()) {
          const messageErrors = validateMessage(value);
          if (messageErrors.length > 0) {
            errors.push(...messageErrors);
          }
        }
        break;
    }
    
    return errors;
  }, []);

  const validateAllFields = useCallback((formData: QuoteFormData): Record<string, string[]> => {
    const allErrors: Record<string, string[]> = {};
    
    const fieldsToValidate: (keyof QuoteFormData)[] = [
      'name', 'email', 'phone', 'city', 'state', 'zipCode',
      'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'
    ];
    
    fieldsToValidate.forEach(field => {
      const value = formData[field];
      if (typeof value === 'string') {
        const errors = validateField(field, value);
        if (errors.length > 0) {
          allErrors[field] = errors;
        }
      }
    });
    
    // Validate message if provided
    if (formData.message) {
      const messageErrors = validateField('message', formData.message);
      if (messageErrors.length > 0) {
        allErrors.message = messageErrors;
      }
    }
    
    return allErrors;
  }, [validateField]);

  return {
    validateField,
    validateAllFields
  };
};
