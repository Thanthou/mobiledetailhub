import { useState } from 'react';

import { FieldErrors } from '../types';

export const useFormValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validateRegisterForm = (formData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): boolean => {
    const errors: FieldErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = ['Name is required'];
    } else if (formData.name.trim().length < 2) {
      errors.name = ['Name must be at least 2 characters'];
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = ['Email is required'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ['Please enter a valid email address'];
    }

    // Password validation
    if (!formData.password) {
      errors.password = ['Password is required'];
    } else if (formData.password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = ['Password must contain at least one uppercase letter, one lowercase letter, and one number'];
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = ['Please enter a valid phone number'];
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  return { validateRegisterForm, getFieldError };
};
