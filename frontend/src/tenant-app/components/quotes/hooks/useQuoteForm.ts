import { useCallback, useEffect, useState } from 'react';

import { useData, useTenantConfigLoader, useVehicleData } from '@/shared/hooks';
import { 
  sanitizeText, 
  validateEmail, 
  validateMessage,
  validateName, 
  validatePhone, 
  validateVehicleField
} from '@/shared/utils';

import { quotesApi } from '../api/quotes.api';
import { type QuoteFormData, type QuoteRequest, quoteRequestSchema,type ServiceArea } from '../types';

export const useQuoteForm = () => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  
  // Get tenant data from centralized hooks
  const { businessName } = useData();
  const { data: tenantConfig } = useTenantConfigLoader();
  const slug = tenantConfig?.slug;
  
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
  
  // Progressive form state
  const [completedSections, setCompletedSections] = useState({
    contact: false,
    vehicle: false,
    services: false
  });

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

  // Get available makes and models based on selected vehicle type
  const availableMakes = formData.vehicleType ? getMakes(formData.vehicleType) : [];
  const availableModels = formData.vehicleType && formData.vehicleMake ? 
    getModels(formData.vehicleType, formData.vehicleMake) : [];

  // Reset vehicle make and model when vehicle type changes
  useEffect(() => {
    if (formData.vehicleType) {
      setFormData(prev => ({
        ...prev,
        vehicleMake: '',
        vehicleModel: ''
      }));
    }
  }, [formData.vehicleType]);

  // Reset vehicle model when vehicle make changes
  useEffect(() => {
    if (formData.vehicleMake) {
      setFormData(prev => ({
        ...prev,
        vehicleModel: ''
      }));
    }
  }, [formData.vehicleMake]);

  // Get service areas from tenant config (if available)
  const serviceAreas = useCallback((): ServiceArea[] => {
    // For now, return empty - service areas will be added to tenant config later
    // When ready, will use: tenantConfig?.serviceAreas
    return [];
  }, []);

  // Get business location from tenant config
  const businessLocation = tenantConfig 
    ? `${tenantConfig.contact.baseLocation.city}, ${tenantConfig.contact.baseLocation.state}`
    : '';

  // businessName and slug loaded from useData() and useTenantConfigLoader()

  // Form validation
  const validateField = useCallback((field: string, value: string): string[] => {
    const errors: string[] = [];
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required');
        } else if (value.length < 2) {
          errors.push('Name must be at least 2 characters');
        }
        validateName(value); // Call for side effects if any
        break;
      case 'email':
        if (!value.trim()) {
          errors.push('Email is required');
        } else if (!value.includes('@')) {
          errors.push('Please enter a valid email address');
        }
        validateEmail(value); // Call for side effects if any
        break;
      case 'phone':
        if (!value.trim()) {
          errors.push('Phone number is required');
        } else if (value.length < 10) {
          errors.push('Please enter a valid phone number');
        }
        validatePhone(value); // Call for side effects if any
        break;
      case 'city':
      case 'state':
      case 'zipCode':
        if (!value.trim()) {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
        break;
      case 'vehicleType':
      case 'vehicleMake':
      case 'vehicleModel':
      case 'vehicleYear':
        if (!value.trim()) {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        } else if (value.length < 2) {
          errors.push(`Please enter a valid ${field}`);
        }
        validateVehicleField(field, value); // Call for side effects if any
        break;
      case 'message':
        if (value.trim() && value.length > 1000) {
          errors.push('Message must be less than 1000 characters');
        }
        validateMessage(value); // Call for side effects if any
        break;
    }
    
    return errors;
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string) => {
    const sanitizedValue = sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear field errors when user starts typing
    if (fieldErrors[field]?.length) {
      setFieldErrors(prev => ({ ...prev, [field]: [] }));
    }
  }, [fieldErrors]);

  // Handle service selection
  const handleServiceToggle = useCallback((service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  }, []);

  // Validate all fields
  const validateAllFields = useCallback((): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'location', 'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'];
    for (const field of requiredFields) {
      const fieldErrors = validateField(field, String(formData[field as keyof QuoteFormData]));
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }
    
    // Validate services
    if (formData.services.length === 0) {
      errors['services'] = ['At least one service must be selected'];
      isValid = false;
    }
    
    // Validate message if provided
    if (formData.message && formData.message.trim()) {
      const messageErrors = validateField('message', formData.message);
      if (messageErrors.length > 0) {
        errors['message'] = messageErrors;
        isValid = false;
      }
    }
    
    setFieldErrors(errors);
    return isValid;
  }, [formData, validateField]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!validateAllFields()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const quoteData: QuoteRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        services: formData.services,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        ...(formData.message && { message: formData.message }),
        ...(slug && { businessSlug: slug })
      };
      
      // Validate with schema
      const validatedData = quoteRequestSchema.parse(quoteData);
      
      await quotesApi.submitQuoteRequest(validatedData as Parameters<typeof quotesApi.submitQuoteRequest>[0]);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting quote request:', error);
      setError('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, slug, validateAllFields]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
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
    setCompletedSections({
      contact: false,
      vehicle: false,
      services: false
    });
  }, []);

  return {
    // Form data
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    completedSections,
    
    // Available options
    vehicleTypes: vehicleTypes.map(vt => vt.name),
    availableMakes,
    availableModels,
    services,
    serviceAreas: serviceAreas(),
    
    // Business info (from tenant config)
    businessName: businessName || '',
    businessLocation,
    businessSlug: slug || '',
    
    // Actions
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm,
    validateField,
    validateAllFields,
    
    // Setters for external control
    setFormData,
    setFieldErrors,
    setIsSubmitted,
    setIsSubmitting,
    setError,
    setCompletedSections
  };
};
