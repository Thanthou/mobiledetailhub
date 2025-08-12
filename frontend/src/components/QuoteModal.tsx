import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { formatPhoneNumberAsTyped, isCompletePhoneNumber } from '../utils/phoneFormatter';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { businessConfig, isLoading: configLoading, error: configError } = useBusinessConfig();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicleType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Use business config for services and vehicle types if available
  const services = businessConfig?.services?.available || [
    'Detail',
    'Ceramic Coating',
    'Paint Protection Film',
    'Other'
  ];

  const vehicleTypes = businessConfig?.services?.vehicleTypes || [
    'Car',
    'Truck',
    'Marine',
    'RV',
    'Motorcycle',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Ensure phone number is properly formatted before submission
      const formattedPhone = formData.phone ? formatPhoneNumberAsTyped(formData.phone, 0).value : '';
      
      await apiService.submitQuoteRequest({
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        vehicle: formData.vehicleType,
        service: formData.service,
        additionalInfo: formData.message
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
          message: ''
        });
        onClose();
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Show loading state while config is loading
  if (configLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-stone-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if config failed to load
  if (configError) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-stone-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center text-white">
            <p className="text-red-400">Error loading configuration</p>
            <button
              onClick={onClose}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-stone-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Request a Quote</h2>
              {businessConfig?.business?.name && (
                <p className="text-sm text-gray-300 mt-1">{businessConfig.business.name}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
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
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
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
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="modal-phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  name="phone"
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
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
                {formData.phone && !isCompletePhoneNumber(formData.phone) && (
                  <p className="text-sm text-orange-400 mt-1">
                    Please enter a complete 10-digit phone number
                  </p>
                )}
              </div>

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
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-vehicleType" className="block text-sm font-medium text-white mb-2">
                  Vehicle Type
                </label>
                <select
                  id="modal-vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-message" className="block text-sm font-medium text-white mb-2">
                  Additional Details
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-stone-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tell us more about your vehicle's condition, preferred appointment time, or any special requests..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none"
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
              <p className="text-gray-300 mb-4">
                Thank you for your request. We'll get back to you within 24 hours.
                {businessConfig?.business?.name && (
                  <span className="block mt-2 text-sm">
                    Your request has been sent to {businessConfig.business.name}.
                  </span>
                )}
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
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