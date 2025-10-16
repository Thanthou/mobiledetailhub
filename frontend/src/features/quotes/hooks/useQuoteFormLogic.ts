import { type FormEvent, useCallback } from 'react';

import { type QuoteFormData } from '../types';
import { useQuoteFormState } from './useQuoteFormState';
import { useQuoteSubmission } from './useQuoteSubmission';
import { useQuoteTenantData } from './useQuoteTenantData';
import { useQuoteValidation } from './useQuoteValidation';
import { useQuoteVehicleData } from './useQuoteVehicleData';

/**
 * Main hook that combines all quote form functionality
 * Now much cleaner and focused on orchestration
 */
export const useQuoteFormLogic = () => {
  // Form state management
  const formState = useQuoteFormState();
  
  // Vehicle data handling
  const vehicleData = useQuoteVehicleData(formState.formData, formState.updateFormData);
  
  // Validation logic
  const validation = useQuoteValidation();
  
  // Submission logic
  const submission = useQuoteSubmission();
  
  // Tenant data handling
  const tenantData = useQuoteTenantData(formState.updateFormData);

  // Available services
  const services = [
    'Interior',
    'Exterior',
    'Interior & Exterior',
    'Paint Correction',
    'Ceramic Coating',
    'Paint Protection Film (PPF)',
    'Other'
  ];

  // Form handlers
  const handleInputChange = useCallback((field: keyof QuoteFormData, value: string) => {
    formState.updateFormData(field, value);
    formState.clearFieldErrors(field);
  }, [formState]);

  const handleServiceToggle = useCallback((service: string) => {
    const currentServices = formState.formData.services;
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
    
    formState.updateFormData('services', updatedServices);
  }, [formState]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    const allErrors = validation.validateAllFields(formState.formData);
    
    if (Object.keys(allErrors).length > 0) {
      Object.entries(allErrors).forEach(([field, errors]) => {
        formState.updateFieldErrors(field, errors);
      });
      return;
    }

    formState.setIsSubmitting(true);
    
    await submission.submitQuote(
      formState.formData,
      tenantData.slug,
      () => {
        formState.setIsSubmitted(true);
        formState.resetForm();
      },
      formState.setError
    );
    
    formState.setIsSubmitting(false);
  }, [formState, validation, submission, tenantData.slug]);

  const resetForm = useCallback(() => {
    formState.resetForm();
  }, [formState]);

  return {
    // Form state
    formData: formState.formData,
    fieldErrors: formState.fieldErrors,
    isSubmitted: formState.isSubmitted,
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    
    // Vehicle data
    vehicleTypes: vehicleData.vehicleTypes,
    availableMakes: vehicleData.availableMakes,
    availableModels: vehicleData.availableModels,
    
    // Services and tenant data
    services,
    serviceAreas: tenantData.serviceAreas(),
    businessName: tenantData.businessName || '',
    businessLocation: tenantData.businessLocation,
    businessSlug: tenantData.slug || '',
    isAffiliate: !!tenantData.slug,
    
    // Handlers
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  };
};
