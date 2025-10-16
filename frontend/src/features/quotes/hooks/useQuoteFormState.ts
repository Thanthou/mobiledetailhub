import { useState } from 'react';

import { type QuoteFormData } from '../types';

/**
 * Hook to manage quote form state
 * Separates form state from business logic
 */
export const useQuoteFormState = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    services: [],
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (field: keyof QuoteFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFieldErrors = (field: string, errors: string[]) => {
    setFieldErrors(prev => ({ ...prev, [field]: errors }));
  };

  const clearFieldErrors = (field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zipCode: '',
      services: [],
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      message: ''
    });
    setFieldErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError('');
  };

  return {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    updateFormData,
    updateFieldErrors,
    clearFieldErrors,
    resetForm,
    setIsSubmitted,
    setIsSubmitting,
    setError
  };
};
