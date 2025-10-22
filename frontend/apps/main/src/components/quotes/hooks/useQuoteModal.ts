import { type MouseEvent, useCallback, useEffect, useState } from 'react';

import { RequestQuoteModalProps } from '../types';

export const useQuoteModal = ({ isOpen, onClose }: RequestQuoteModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Define handleClose first before it's used
  const handleClose = useCallback(() => {
    // Close immediately; parent controls visibility. Do not block while opening.
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => { setIsAnimating(true); }, 10);
      return () => { clearTimeout(timer); };
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => { setIsVisible(false); }, 300);
      return () => { clearTimeout(timer); };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  return {
    isVisible,
    isAnimating,
    handleClose,
    handleBackdropClick
  };
};
