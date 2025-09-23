import React, { useCallback } from 'react';

import { Modal } from '@/shared/ui';

import { type RequestQuoteModalProps } from '../types';
import { useQuoteFormLogic, useQuoteModal } from '../hooks';
import QuoteForm from './QuoteForm';
import SuccessMessage from './SuccessMessage';

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ isOpen, onClose }) => {
  const {
    formData,
    fieldErrors,
    isSubmitted,
    isSubmitting,
    error,
    services,
    serviceAreas,
    businessName,
    businessLocation,
    isAffiliate,
    handleInputChange,
    handleServiceToggle,
    handleSubmit,
    resetForm
  } = useQuoteFormLogic();

  const { handleClose } = useQuoteModal({ isOpen, onClose });

  const handleCloseWithReset = useCallback(() => {
    handleClose();
    resetForm();
  }, [handleClose, resetForm]);

  const modalTitle = isSubmitted 
    ? 'Quote Request Sent!' 
    : `Request a Quote ${businessName ? `for ${businessName}` : ''}`;

  const modalDescription = isSubmitted 
    ? 'Thank you for your interest! We will get back to you soon.' 
    : 'Fill out the form below and we\'ll get back to you with a personalized quote.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithReset}
      title={modalTitle}
      description={modalDescription}
      size="xl"
      className="bg-stone-800 text-white"
    >
      {isSubmitted ? (
        <SuccessMessage onClose={handleCloseWithReset} />
      ) : (
        <QuoteForm
          formData={formData}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          error={error}
          services={services}
          serviceAreas={serviceAreas}
          isAffiliate={isAffiliate}
          businessLocation={businessLocation}
          handleInputChange={handleInputChange}
          handleServiceToggle={handleServiceToggle}
          handleSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
};

export default RequestQuoteModal;