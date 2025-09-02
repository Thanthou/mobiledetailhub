import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { formatPhoneNumberAsTyped, isCompletePhoneNumber } from '../../utils/fields/phoneFormatter';
import { useVehicleData } from '../../hooks/useVehicleData';
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateVehicleField, 
  validateService, 
  validateMessage,
  sanitizeText 
} from '../../utils/validation';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: [] as string[],
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

  // Update completed sections when form data changes
  useEffect(() => {
    setCompletedSections({
      contact: isContactSectionComplete(),
      vehicle: isVehicleSectionComplete(),
      services: isServicesSectionComplete()
    });
  }, [formData]);

  // Helper function to display field errors
  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName]?.length;
  };

  // Section validation functions
  const isContactSectionComplete = () => {
    const nameValid = validateName(formData.name).isValid;
    const emailValid = validateEmail(formData.email).isValid;
    const phoneValid = validatePhone(formData.phone).isValid;
    return nameValid && emailValid && phoneValid;
  };

  const isVehicleSectionComplete = () => {
    const vehicleTypeValid = validateVehicleField(formData.vehicleType, 'Vehicle type').isValid;
    const vehicleMakeValid = validateVehicleField(formData.vehicleMake, 'Vehicle make').isValid;
    const vehicleModelValid = validateVehicleField(formData.vehicleModel, 'Vehicle model').isValid;
    const vehicleYearValid = validateVehicleField(formData.vehicleYear, 'Vehicle year').isValid;
    return vehicleTypeValid && vehicleMakeValid && vehicleModelValid && vehicleYearValid;
  };

  const isServicesSectionComplete = () => {
    return formData.services.length > 0;
  };

  const clearFormData = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      services: [],
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      message: ''
    });
    setFieldErrors({});
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => {
      let newServices = [...prev.services];
      
      if (checked) {
        // Add the selected service
        newServices.push(service);
        
        // Handle mutual exclusivity for Interior/Exterior/Interior & Exterior
        if (service === 'Interior & Exterior') {
          // If "Interior & Exterior" is selected, remove "Interior" and "Exterior"
          newServices = newServices.filter(s => s !== 'Interior' && s !== 'Exterior');
        } else if (service === 'Interior' || service === 'Exterior') {
          // If "Interior" or "Exterior" is selected, remove "Interior & Exterior"
          newServices = newServices.filter(s => s !== 'Interior & Exterior');
          
          // Check if both "Interior" and "Exterior" are now selected
          const hasInterior = newServices.includes('Interior');
          const hasExterior = newServices.includes('Exterior');
          
          if (hasInterior && hasExterior) {
            // Remove both "Interior" and "Exterior" and add "Interior & Exterior"
            newServices = newServices.filter(s => s !== 'Interior' && s !== 'Exterior');
            newServices.push('Interior & Exterior');
          }
        }
      } else {
        // Remove the deselected service
        newServices = newServices.filter(s => s !== service);
      }
      
      return {
        ...prev,
        services: newServices
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate all required fields
    const validations = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      services: formData.services.length === 0 
        ? { isValid: false, errors: ['Please select at least one service'], sanitizedValue: [] }
        : { isValid: true, errors: [], sanitizedValue: formData.services },
      vehicleType: validateVehicleField(formData.vehicleType, 'Vehicle type'),
      vehicleMake: validateVehicleField(formData.vehicleMake, 'Vehicle make'),
      vehicleModel: validateVehicleField(formData.vehicleModel, 'Vehicle model'),
      vehicleYear: validateVehicleField(formData.vehicleYear, 'Vehicle year'),
      message: validateMessage(formData.message, false) // Message is optional
    };

    // Check if any validation failed
    const hasErrors = Object.values(validations).some(result => !result.isValid);
    
    if (hasErrors) {
      // Set field errors for display
      const errors: Record<string, string[]> = {};
      Object.entries(validations).forEach(([field, result]) => {
        if (!result.isValid) {
          errors[field] = result.errors;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize and format data before submission
      const formattedPhone = formData.phone ? formatPhoneNumberAsTyped(formData.phone, 0).value : '';
      
      await apiService.submitQuoteRequest({
        name: sanitizeText(validations.name.sanitizedValue!),
        email: validations.email.sanitizedValue!,
        phone: formattedPhone,
        vehicle: `${validations.vehicleYear.sanitizedValue} ${validations.vehicleMake.sanitizedValue} ${validations.vehicleModel.sanitizedValue}`,
        services: validations.services.sanitizedValue!,
        additionalInfo: formData.message ? sanitizeText(formData.message) : ''
      });

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          services: [],
          vehicleType: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: '',
          message: ''
        });
        setFieldErrors({});
        onClose();
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-[2vh] pb-[15vh]">
            <div
        className="bg-stone-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto scrollbar-hide"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        onWheel={(e) => {
          // Allow scrolling with mouse wheel
          e.currentTarget.scrollTop += e.deltaY;
        }}
      >
        <div className="p-4">
          <div className="relative mb-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Request a Quote</h2>
            </div>
            <button
              onClick={() => {
                clearFormData();
                onClose();
              }}
              className="absolute top-0 right-0 text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Progress</span>
                  <span className="text-sm text-gray-300">
                    {[completedSections.contact, completedSections.vehicle, completedSections.services].filter(Boolean).length}/3
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${([completedSections.contact, completedSections.vehicle, completedSections.services].filter(Boolean).length / 3) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Contact Information Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600 flex items-center gap-2">
                  Contact Information
                  {completedSections.contact && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('name') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                      placeholder="Your full name"
                    />
                    {hasFieldError('name') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('name')}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-medium text-white mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="modal-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        const input = e.target.value;
                        const cursorPosition = e.target.selectionStart || 0;
                        
                        // Format the phone number as user types
                        const { value: formattedValue, cursorPosition: newPosition } = formatPhoneNumberAsTyped(input, cursorPosition);
                        
                        // Update form data
                        setFormData(prev => ({
                          ...prev,
                          phone: formattedValue
                        }));
                        
                        // Set cursor position after React re-renders
                        setTimeout(() => {
                          e.target.setSelectionRange(newPosition, newPosition);
                        }, 0);
                      }}
                      onBlur={(e) => {
                        // Format on blur to ensure proper format
                        const formatted = formatPhoneNumberAsTyped(e.target.value, 0).value;
                        setFormData(prev => ({
                          ...prev,
                          phone: formatted
                        }));
                      }}
                      autoComplete="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('phone') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                      placeholder="(555) 123-4567"
                    />
                    {hasFieldError('phone') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('phone')}
                      </p>
                    )}
                    {formData.phone && !isCompletePhoneNumber(formData.phone) && !hasFieldError('phone') && (
                      <p className="text-sm text-orange-400 mt-1">
                        Please enter a complete 10-digit phone number
                      </p>
                    )}
                  </div>

                  {/* Email - Full Width */}
                  <div className="md:col-span-2">
                    <label htmlFor="modal-email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="modal-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('email') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                      placeholder="your@email.com"
                    />
                    {hasFieldError('email') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information Section */}
              {completedSections.contact && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600 flex items-center gap-2">
                    Vehicle Information
                    {completedSections.vehicle && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Year */}
                  <div className="relative">
                    <label htmlFor="modal-vehicleYear" className="block text-sm font-medium text-white mb-2">
                      Vehicle Year *
                    </label>
                    <div className="relative">
                      <select
                        id="modal-vehicleYear"
                        name="vehicleYear"
                        required
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                        autoComplete="vehicle-year"

                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                          hasFieldError('vehicleYear') 
                            ? 'border-red-500 bg-red-900/20' 
                            : 'border-gray-600 bg-stone-700'
                        } text-white`}
                        style={{ 
                          position: 'relative',
                          zIndex: 20,
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 76 }, (_, i) => 2026 - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                        <option value="before-1950">Before 1950</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-30">
                        <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {hasFieldError('vehicleYear') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleYear')}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Type */}
                  <div className="relative">
                    <label htmlFor="modal-vehicleType" className="block text-sm font-medium text-white mb-2">
                      Vehicle Type *
                    </label>
                    <div className="relative">
                      <select
                        id="modal-vehicleType"
                        name="vehicleType"
                        required
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        autoComplete="vehicle-type"
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                          hasFieldError('vehicleType') 
                            ? 'border-red-500 bg-red-900/20' 
                            : 'border-gray-600 bg-stone-700'
                        } text-white`}
                        style={{ 
                          position: 'relative',
                          zIndex: 20,
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      >
                        <option value="">Select vehicle type</option>
                        {vehicleTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-30">
                        <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {hasFieldError('vehicleType') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleType')}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Make */}
                  <div className="relative">
                    <label htmlFor="modal-vehicleMake" className="block text-sm font-medium text-white mb-2">
                      Vehicle Make *
                    </label>
                    <div className="relative">
                      <select
                        id="modal-vehicleMake"
                        name="vehicleMake"
                        required
                        value={formData.vehicleMake}
                        onChange={handleInputChange}
                        disabled={!formData.vehicleType}
                        autoComplete="vehicle-make"

                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          hasFieldError('vehicleMake') 
                            ? 'border-red-500 bg-red-900/20' 
                            : 'border-gray-600 bg-stone-700'
                        } text-white`}
                        style={{ 
                          position: 'relative',
                          zIndex: 20,
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      >
                        <option value="">Select make</option>
                        {availableMakes.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-30">
                        <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {hasFieldError('vehicleMake') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleMake')}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Model */}
                  <div className="relative">
                    <label htmlFor="modal-vehicleModel" className="block text-sm font-medium text-white mb-2">
                      Vehicle Model *
                    </label>
                    <div className="relative">
                      <select
                        id="modal-vehicleModel"
                        name="vehicleModel"
                        required
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        disabled={!formData.vehicleMake}
                        autoComplete="vehicle-model"

                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          hasFieldError('vehicleModel') 
                            ? 'border-red-500 bg-red-900/20' 
                            : 'border-gray-600 bg-stone-700'
                        } text-white`}
                        style={{ 
                          position: 'relative',
                          zIndex: 20,
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                      >
                        <option value="">Select model</option>
                        {availableModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-30">
                        <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {hasFieldError('vehicleModel') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleModel')}
                      </p>
                    )}
                  </div>
                </div>
                </div>
              )}

              {/* Service Section */}
              {completedSections.vehicle && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600 flex items-center gap-2">
                    Service Details
                    {completedSections.services && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Services */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-white mb-3">
                      Services Needed *
                    </label>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg ${
                      hasFieldError('services') 
                        ? 'border-red-500 bg-red-900/20' 
                        : 'border-gray-600 bg-stone-700'
                    }`}>
                      {services.map((service) => (
                        <label key={service} className="flex items-center space-x-3 cursor-pointer hover:bg-stone-600/50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={(e) => handleServiceChange(service, e.target.checked)}
                            className="w-4 h-4 text-orange-500 bg-stone-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="text-white text-sm font-medium">{service}</span>
                        </label>
                      ))}
                    </div>
                    {hasFieldError('services') && (
                      <p className="text-sm text-red-400 mt-2">
                        {getFieldError('services')}
                      </p>
                    )}
                    {formData.services.length > 0 && (
                      <p className="text-sm text-gray-300 mt-2">
                        Selected: {formData.services.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="md:col-span-3">
                    <label htmlFor="modal-message" className="block text-sm font-medium text-white mb-2">
                      Additional Details
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('message') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                      placeholder="Tell us more about your vehicle's condition, preferred appointment time, or any special requests..."
                    />
                    {hasFieldError('message') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('message')}
                      </p>
                    )}
                  </div>
                </div>
                </div>
              )}

              {/* Submit Buttons - Only show when ALL sections are completed */}
              {completedSections.contact && completedSections.vehicle && completedSections.services && (
                <div className="flex gap-4 pt-6 border-t border-gray-600">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearFormData();
                      onClose();
                    }}
                    className="flex-1 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Request Sent!</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Thank you for your request. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
