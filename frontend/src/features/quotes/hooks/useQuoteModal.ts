import { useCallback, useEffect, useState } from 'react';

import { RequestQuoteModalProps } from '../types';

export const useQuoteModal = ({ isOpen, onClose }: RequestQuoteModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
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
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isAnimating) return; // Prevent double-closing during animation
    onClose();
  }, [onClose, isAnimating]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return {
    isVisible,
    isAnimating,
    handleClose,
    handleBackdropClick
  };
};
