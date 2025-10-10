import { type FormEvent, useCallback, useEffect, useState } from 'react';

import { useTenantConfig, useVehicleData } from '@/shared/hooks';
import {
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  validateVehicleField
} from '@/shared/utils';

import { quotesApi } from '../api/quotes.api';
import { type QuoteFormData,type QuoteRequest, quoteRequestSchema } from '../types';

export const useQuoteFormLogic = () => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  
  // Get tenant data from centralized system
  const { tenantConfig, businessName, slug } = useTenantConfig();

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
  const serviceAreas = useCallback((): Array<{ city: string; state: string; primary?: boolean }> => {
    // For now, return empty - service areas will be added to tenant config later
    // When ready, will use: tenantConfig?.serviceAreas
    return [];
  }, []);

  // Get business location from tenant config
  const businessLocation = tenantConfig 
    ? `${tenantConfig.contact.baseLocation.city}, ${tenantConfig.contact.baseLocation.state}`
    : '';

  // Already have businessName and slug from useTenantConfig()

  // Form validation
  const validateField = useCallback((field: keyof QuoteFormData, value: string): string[] => {
    const errors: string[] = [];
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required.');
        } else if (value.length < 2) {
          errors.push('Please enter a valid name.');
        }
        validateName(value); // Call for side effects if any
        break;
      case 'email':
        if (!value.trim()) {
          errors.push('Email is required.');
        } else if (!value.includes('@')) {
          errors.push('Please enter a valid email address.');
        }
        validateEmail(value); // Call for side effects if any
        break;
      case 'phone':
        if (!value.trim()) {
          errors.push('Phone number is required.');
        } else if (value.length < 10) {
          errors.push('Please enter a valid 10-digit phone number.');
        }
        validatePhone(value); // Call for side effects if any
        break;
      case 'city':
        if (!value.trim()) {
          errors.push('City is required.');
        }
        break;
      case 'state':
        if (!value.trim()) {
          errors.push('State is required.');
        } else if (value.length !== 2) {
          errors.push('State must be 2 characters.');
        }
        break;
      case 'zipCode':
        if (!value.trim()) {
          errors.push('Zip code is required.');
        } else if (!/^\d{5}$/.test(value)) {
          errors.push('Zip code must be 5 digits.');
        }
        break;
      case 'vehicleType':
      case 'vehicleMake':
      case 'vehicleModel':
      case 'vehicleYear':
        if (!value.trim()) {
          errors.push(`${field.replace('vehicle', 'Vehicle ')} is required.`);
        } else if (!validateVehicleField(value, field.replace('vehicle', 'Vehicle ')).isValid) {
          errors.push(`Please enter a valid ${field.replace('vehicle', 'vehicle ')}.`);
        }
        break;
      case 'message':
        if (value.trim() && value.length > 1000) {
          errors.push('Message is too long or contains invalid characters.');
        }
        validateMessage(value); // Call for side effects if any
        break;
    }
    
    return errors;
  }, []);

  const handleInputChange = useCallback((field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => {
      const { [field]: _removed, ...newErrors } = prev;
      return newErrors;
    });
  }, []);

  const handleServiceToggle = useCallback((serviceName: string) => {
    setFormData(prev => {
      const currentServices = prev.services;
      if (currentServices.includes(serviceName)) {
        return { ...prev, services: currentServices.filter(s => s !== serviceName) };
      } else {
        return { ...prev, services: [...currentServices, serviceName] };
      }
    });
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['services'];
      return newErrors;
    });
  }, []);

  const validateAllFields = useCallback((): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    
    // Validate required fields
    const requiredFields: Array<keyof QuoteFormData> = ['name', 'email', 'phone', 'city', 'state', 'zipCode', 'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'];
    for (const field of requiredFields) {
      const fieldErrors = validateField(field, formData[field] as string);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }
    
    // Validate services
    if (formData['services'].length === 0) {
      errors['services'] = ['At least one service must be selected'];
      isValid = false;
    }
    
    // Validate message if provided
    if (formData['message'] && formData['message'].trim()) {
      const messageErrors = validateField('message', formData['message']);
      if (messageErrors.length > 0) {
        errors['message'] = messageErrors;
        isValid = false;
      }
    }
    
    setFieldErrors(errors);
    return isValid;
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '', email: '', phone: '', city: '', state: '', zipCode: '', services: [],
      vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleYear: '', message: ''
    });
    setFieldErrors({});
    setIsSubmitted(false);
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateAllFields()) {
      setError('Please correct the errors in the form.');
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
        services: formData['services'],
        message: formData['message'] ?? '',
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        businessSlug: slug || undefined
      };

      // Validate with schema
      const validatedData = quoteRequestSchema.parse(quoteData);

      // Ensure message and businessSlug are properly typed for API compatibility
      const apiData = {
        ...validatedData,
        message: validatedData.message ?? '',
        businessSlug: slug ?? undefined
      };

      await quotesApi.submitQuoteRequest(apiData as Parameters<typeof quotesApi.submitQuoteRequest>[0]);
      setIsSubmitted(true);
      resetForm();
    } catch (err) {
      console.error('Quote submission error:', err);
      setError('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAllFields, slug, resetForm]);

  // Set initial location if available
  useEffect(() => {
    if (businessLocation && tenantConfig) {
      // Use tenant location data
      setFormData(prev => ({ 
        ...prev, 
        city: tenantConfig.contact.baseLocation.city,
        state: tenantConfig.contact.baseLocation.state
      }));
    }
  }, [businessLocation, tenantConfig]);

  return {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    services,
    vehicleTypes,
    availableMakes,
    availableModels,
    serviceAreas: serviceAreas(),
    businessName: businessName || '',
    businessLocation,
    businessSlug: slug || '',
    isAffiliate: !!slug, // User is viewing an affiliate site if there's a business slug
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  };
};
