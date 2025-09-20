import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui';

import { type RequestQuoteModalProps } from '../types';
import { useQuoteFormLogic } from '../hooks';
import ContactSection from './ContactSection';
import ServicesSection from './ServicesSection';
import SuccessMessage from './SuccessMessage';
import VehicleSection from './VehicleSection';

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ isOpen, onClose }) => {
  const {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    services,
    vehicleTypes,
    availableMakes,
    availableModels,
    serviceAreas,
    businessName,
    businessLocation,
    isAffiliate,
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  } = useQuoteFormLogic();

  // Modal visibility and animation
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
      resetForm(); // Reset form on close
    }, 300);
    return () => clearTimeout(timer);
  }, [onClose, resetForm]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isVisible) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="quote-modal-title" className="text-2xl font-bold text-gray-800">
            {isSubmitted ? 'Quote Request Sent!' : `Request a Quote ${businessName ? `for ${businessName}` : ''}`}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close quote request modal"
          >
            <X size={24} />
          </Button>
        </div>

        {isSubmitted ? (
          <SuccessMessage onClose={handleClose} />
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            <ContactSection
              formData={formData}
              fieldErrors={fieldErrors}
              isSubmitting={isSubmitting}
              isAffiliate={isAffiliate}
              businessLocation={businessLocation}
              serviceAreas={serviceAreas}
              onInputChange={handleInputChange}
            />

            <VehicleSection
              formData={formData}
              fieldErrors={fieldErrors}
              isSubmitting={isSubmitting}
              vehicleTypes={vehicleTypes}
              availableMakes={availableMakes}
              availableModels={availableModels}
              onInputChange={handleInputChange}
            />

            <ServicesSection
              formData={formData}
              fieldErrors={fieldErrors}
              isSubmitting={isSubmitting}
              services={services}
              onServiceToggle={handleServiceToggle}
              onInputChange={handleInputChange}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="min-w-[150px]"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Quote
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestQuoteModal;