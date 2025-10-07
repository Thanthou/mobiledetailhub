import { useCallback, useEffect, useState } from 'react';

// import { useAffiliate } from '@/features/affiliateDashboard/hooks'; // Removed - using shared hook instead
import { useVehicleData } from '@/features/booking/hooks';
// import { useLocation } from '@/shared/hooks';
import { useSiteContext } from '@/shared/hooks';
import { 
  sanitizeText, 
  validateEmail, 
  validateMessage,
  validateName, 
  validatePhone, 
  validateVehicleField
} from '@/shared/utils';

import { quotesApi } from '../api/quotes.api';
import { type QuoteFormData, type ServiceArea, type QuoteRequest, quoteRequestSchema } from '../types';

export const useQuoteForm = () => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  // const { selectedLocation } = useLocation();
  const { isAffiliate } = useSiteContext();
  
  // Safely get affiliate data - it might not be available on all pages
  let affiliateData: unknown = null;
  let hasAffiliateContext = false;
  try {
    const affiliateContext = useAffiliate();
    affiliateData = affiliateContext.affiliateData;
    hasAffiliateContext = true;
  } catch {
    // useAffiliate not available (no AffiliateProvider)
    // This is expected on non-affiliate pages
    affiliateData = null;
    hasAffiliateContext = false;
  }
  
  const [formData, setFormData] = useState<QuoteFormData>({
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

  // Process service areas from affiliate data
  const serviceAreas = useCallback((): ServiceArea[] => {
    // Only process service areas if we're on an affiliate page and have affiliate data
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
      // Sort by state, with primary location first
      const processedAreas = serviceAreasData
        .map((area: unknown): ServiceArea => {
          const areaData = area as { city?: string; state?: string; primary?: boolean };
          return {
            city: areaData.city || '',
            state: areaData.state || '',
            primary: areaData.primary || false
          };
        })
        .filter(area => area.city && area.state)
        .sort((a, b) => {
          // Primary locations first
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          // Then sort by state, then city
          if (a.state !== b.state) return a.state.localeCompare(b.state);
          return a.city.localeCompare(b.city);
        });
      
      return processedAreas;
    }
    
    return [];
  }, [hasAffiliateContext, affiliateData]);

  // Get business name and location from affiliate data
  const businessName = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'business_name' in affiliateData 
    ? String(affiliateData.business_name) 
    : '';

  const businessLocation = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'base_location' in affiliateData 
    ? String(affiliateData.base_location) 
    : '';

  const businessSlug = hasAffiliateContext && affiliateData && typeof affiliateData === 'object' && affiliateData !== null && 'slug' in affiliateData 
    ? String(affiliateData.slug) 
    : '';

  // Form validation
  const validateField = useCallback((field: string, value: string): string[] => {
    const errors: string[] = [];
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.push('Name is required');
        } else if (!validateName(value)) {
          errors.push('Name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes');
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.push('Email is required');
        } else if (!validateEmail(value)) {
          errors.push('Please enter a valid email address');
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.push('Phone number is required');
        } else if (!validatePhone(value)) {
          errors.push('Please enter a valid phone number');
        }
        break;
      case 'location':
        if (!value.trim()) {
          errors.push('Location is required');
        }
        break;
      case 'vehicleType':
      case 'vehicleMake':
      case 'vehicleModel':
      case 'vehicleYear':
        if (!value.trim()) {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        } else if (!validateVehicleField(field, value)) {
          errors.push(`Please enter a valid ${field}`);
        }
        break;
      case 'message':
        if (value.trim() && !validateMessage(value)) {
          errors.push('Message must be less than 1000 characters');
        }
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
        location: formData.location,
        ...(formData.message && { message: formData.message }),
        ...(businessSlug && { businessSlug })
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
  }, [formData, businessSlug, validateAllFields]);

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
    
    // Business info
    businessName,
    businessLocation,
    businessSlug,
    isAffiliate,
    hasAffiliateContext,
    
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
