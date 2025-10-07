import { useCallback, useEffect, useState } from 'react';

// import { useAffiliate } from '@/features/affiliateDashboard/hooks';
import { useVehicleData } from '@/features/booking/hooks';
// import { useLocation } from '@/shared/hooks'; // Removed - using tenant data instead
import { useSiteContext } from '@/shared/hooks';
import {
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  validateVehicleField
} from '@/shared/utils';

import { quotesApi } from '../api/quotes.api';
import { type QuoteRequest, quoteRequestSchema, type QuoteFormData } from '../types';

export const useQuoteFormLogic = () => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  // const { selectedLocation } = useLocation(); // Removed - using tenant data instead
  const { isAffiliate } = useSiteContext();

  // Safely get affiliate data - it might not be available on all pages
  // For now, we'll disable affiliate functionality to prevent white screen
  const affiliateData: unknown = null;
  const hasAffiliateContext = false;

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

  // Process service areas from affiliate data
  const serviceAreas = useCallback((): Array<{ city: string; state: string; primary?: boolean }> => {
    if (!hasAffiliateContext || !affiliateData || typeof affiliateData !== 'object' || affiliateData === null) {
      return [];
    }

    const affiliateDataObj = affiliateData as Record<string, unknown>;
    if (!('service_areas' in affiliateDataObj)) {
      return [];
    }

    let serviceAreasData: unknown = affiliateDataObj['service_areas'];
    if (typeof serviceAreasData === 'string') {
      try {
        serviceAreasData = JSON.parse(serviceAreasData);
      } catch (error) {
        console.error('Error parsing service_areas JSON:', error);
        return [];
      }
    }

    if (Array.isArray(serviceAreasData)) {
      const processedAreas = serviceAreasData
        .map((area: unknown): { city: string; state: string; primary?: boolean } => {
          const areaData = area as { city?: string; state?: string; primary?: boolean };
          return {
            city: areaData.city || '',
            state: areaData.state || '',
            primary: areaData.primary || false
          };
        })
        .filter(area => area.city && area.state)
        .sort((a, b) => {
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          if (a.state !== b.state) return a.state.localeCompare(b.state);
          return a.city.localeCompare(b.city);
        });

      return processedAreas;
    }

    return [];
  }, [hasAffiliateContext, affiliateData]);

  // Get business name and location from affiliate data
  const businessName = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'business_name' in affiliateData
    ? String((affiliateData as Record<string, unknown>)['business_name'])
    : '';

  const businessLocation = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'base_location' in affiliateData
    ? String((affiliateData as Record<string, unknown>)['base_location'])
    : '';

  const businessSlug = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'slug' in affiliateData
    ? String((affiliateData as Record<string, unknown>)['slug'])
    : '';

  // Form validation
  const validateField = useCallback((field: keyof QuoteFormData, value: string): string[] => {
    const errors: string[] = [];
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required.');
        } else if (!validateName(value)) {
          errors.push('Please enter a valid name.');
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.push('Email is required.');
        } else if (!validateEmail(value)) {
          errors.push('Please enter a valid email address.');
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.push('Phone number is required.');
        } else if (!validatePhone(value)) {
          errors.push('Please enter a valid 10-digit phone number.');
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
        if (value.trim() && !validateMessage(value)) {
          errors.push('Message is too long or contains invalid characters.');
        }
        break;
    }
    
    return errors;
  }, []);

  const handleInputChange = useCallback((field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
        businessSlug: businessSlug || undefined
      };

      // Validate with schema
      const validatedData = quoteRequestSchema.parse(quoteData);

      // Ensure message and businessSlug are properly typed for API compatibility
      const apiData = {
        ...validatedData,
        message: validatedData.message ?? '',
        businessSlug: validatedData.businessSlug ?? undefined
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
  }, [formData, validateAllFields, businessSlug]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '', email: '', phone: '', city: '', state: '', zipCode: '', services: [],
      vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleYear: '', message: ''
    });
    setFieldErrors({});
    setIsSubmitted(false);
    setError('');
  }, []);

  // Set initial location if available
  useEffect(() => {
    if (isAffiliate && businessLocation) {
      setFormData(prev => ({ ...prev, location: businessLocation }));
    } else {
      // Use tenant location data if available
      setFormData(prev => ({ ...prev, location: 'Service Area' }));
    }
  }, [isAffiliate, businessLocation]);

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
    businessName,
    businessLocation,
    businessSlug,
    isAffiliate,
    hasAffiliateContext,
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  };
};
