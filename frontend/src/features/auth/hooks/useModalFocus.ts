import { useCallback, useEffect, useRef, useState } from 'react';

export const useModalFocus = (isOpen: boolean, onClose: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }, [onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when modal opens
      setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        }
      }, 100);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Add event listeners for accessibility
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setMounted(true);
    return () => { setMounted(false); };
  }, []);

  return { modalRef, firstFocusableRef, mounted };
};
