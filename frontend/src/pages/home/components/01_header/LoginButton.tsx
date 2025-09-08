import React, { useEffect, useRef, useState } from 'react';

import { LazyLoginModal, prefetchLoginModal } from '@/components/login';
import { useAuth } from '@/hooks/useAuth';
import { useModalPrefetch } from '@/utils/modalCodeSplitting';

import UserMenu from './UserMenu';

// Define modal prefetch type
interface ModalPrefetchType {
  handleHover: (modalType: string) => void;
  handleFocus: (modalType: string) => void;
}

const LoginButton: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalPrefetch = useModalPrefetch() as ModalPrefetchType | undefined;
  const handleHover = modalPrefetch?.handleHover ?? (() => {});
  const handleFocus = modalPrefetch?.handleFocus ?? (() => {});

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setShowModal(true);
        break;
      case 'Escape':
        if (showModal) {
          setShowModal(false);
          // Return focus to button when modal closes
          buttonRef.current?.focus();
        }
        break;
    }
  };

  // Handle modal close and focus management
  const handleModalClose = () => {
    setShowModal(false);
    // Return focus to the button when modal closes
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 100);
  };

  // Enhanced prefetch handlers using the new system
  const handleModalHover = (): void => {
    try {
      handleHover('login');
      // Fallback to legacy prefetch
      prefetchLoginModal();
    } catch (error) {
      console.warn('Error in handleModalHover:', error);
      // Fallback to legacy prefetch only
      prefetchLoginModal();
    }
  };

  const handleModalFocus = (): void => {
    try {
      handleFocus('login');
      // Fallback to legacy prefetch
      prefetchLoginModal();
    } catch (error) {
      console.warn('Error in handleModalFocus:', error);
      // Fallback to legacy prefetch only
      prefetchLoginModal();
    }
  };

  // Focus management when component mounts
  useEffect(() => {
    if (showModal) {
      // Focus the modal when it opens (LoginModal should handle this)
      // The modal will manage its own focus trap
    }
  }, [showModal]);

  if (isLoggedIn) {
    return <UserMenu />;
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => { setShowModal(true); }}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleModalHover}
        onFocus={handleModalFocus}
        className="text-white hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900 transition-colors duration-200 font-medium px-3 py-2 rounded-md"
        aria-label="Open login modal to sign in or create account"
        aria-haspopup="dialog"
        aria-expanded={showModal}
        aria-describedby="login-button-description"
        type="button"
        tabIndex={0}
      >
        Login
        <span 
          id="login-button-description" 
          className="sr-only"
        >
          Click to open login modal. You can sign in to your existing account or create a new account.
        </span>
      </button>

      <LazyLoginModal 
        isOpen={showModal} 
        onClose={handleModalClose} 
      />
    </>
  );
};

export default LoginButton;