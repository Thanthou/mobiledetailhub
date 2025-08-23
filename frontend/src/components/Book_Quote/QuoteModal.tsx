import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { formatPhoneNumberAsTyped, isCompletePhoneNumber } from '../../utils/phoneFormatter';
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
    service: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Available services
  const services = [
    'Detail',
    'Ceramic Coating',
    'Paint Protection Film',
    'Interior Detailing',
    'Exterior Detailing',
    'Full Service',
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

  // Helper function to display field errors
  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName]?.length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      service: validateService(formData.service),
      vehicleType: validateVehicleField(formData.vehicleType, 'Vehicle type'),
      vehicleMake: validateVehicleField(formData.vehicleMake, 'Vehicle make'),
      vehicleModel: validateVehicleField(formData.vehicleModel, 'Vehicle model'),
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
        vehicle: `${validations.vehicleMake.sanitizedValue} ${validations.vehicleModel.sanitizedValue}`,
        service: validations.service.sanitizedValue!,
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
          service: '',
          vehicleType: '',
          vehicleMake: '',
          vehicleModel: '',
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-stone-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Request a Quote</h2>
              <p className="text-sm text-gray-300 mt-1">Get a custom quote for your vehicle</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Contact Information Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600">
                  Contact Information
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
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600">
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Vehicle Type */}
                  <div>
                    <label htmlFor="modal-vehicleType" className="block text-sm font-medium text-white mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      id="modal-vehicleType"
                      name="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      autoComplete="vehicle-type"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('vehicleType') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {hasFieldError('vehicleType') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleType')}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Make */}
                  <div>
                    <label htmlFor="modal-vehicleMake" className="block text-sm font-medium text-white mb-2">
                      Vehicle Make *
                    </label>
                    <select
                      id="modal-vehicleMake"
                      name="vehicleMake"
                      required
                      value={formData.vehicleMake}
                      onChange={handleInputChange}
                      disabled={!formData.vehicleType}
                      autoComplete="vehicle-make"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        hasFieldError('vehicleMake') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                    >
                      <option value="">Select make</option>
                      {availableMakes.map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                    {hasFieldError('vehicleMake') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleMake')}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Model */}
                  <div>
                    <label htmlFor="modal-vehicleModel" className="block text-sm font-medium text-white mb-2">
                      Vehicle Model *
                    </label>
                    <select
                      id="modal-vehicleModel"
                      name="vehicleModel"
                      required
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      disabled={!formData.vehicleMake}
                      autoComplete="vehicle-model"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        hasFieldError('vehicleModel') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                    >
                      <option value="">Select model</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    {hasFieldError('vehicleModel') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('vehicleModel')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-600">
                  Service Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Service */}
                  <div>
                    <label htmlFor="modal-service" className="block text-sm font-medium text-white mb-2">
                      Service Needed *
                    </label>
                    <select
                      id="modal-service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      autoComplete="service"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        hasFieldError('service') 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-600 bg-stone-700'
                      } text-white`}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {hasFieldError('service') && (
                      <p className="text-sm text-red-400 mt-1">
                        {getFieldError('service')}
                      </p>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="md:col-span-2">
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

              {/* Submit Buttons */}
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
                  onClick={onClose}
                  className="flex-1 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
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
