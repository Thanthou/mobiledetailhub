import { X } from 'lucide-react';
import React, { useState } from 'react';

import { ReviewForm } from './ReviewForm';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessSlug?: string;
  businessName?: string;
  reviewType: 'affiliate' | 'mdh';
  onSuccess?: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  businessSlug,
  businessName,
  reviewType,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      // The actual submission is handled by the ReviewForm component
      // This is just for any additional logic after successful submission
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error in review submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 bg-stone-700 hover:bg-stone-600 text-white rounded-full p-2 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal content */}
          <div className="bg-stone-800 rounded-xl shadow-2xl">
            <ReviewForm
              businessSlug={businessSlug}
              businessName={businessName}
              reviewType={reviewType}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
