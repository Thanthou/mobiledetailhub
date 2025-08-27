import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePhone,
  sanitizeText 
} from '../../utils/validation';
import ModalHeader from './ModalHeader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SocialLogin from './SocialLogin';
import ToggleMode from './ToggleMode';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.errors[0]);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password, true);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors[0]);
        return;
      }

      const result = await login(emailValidation.sanitizedValue!, password);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, phone: string) => {
    setError('');
    setLoading(true);

    try {
      // Validate all fields
      const validations = {
        email: validateEmail(email),
        password: validatePassword(password, false),
        name: validateName(name),
        phone: validatePhone(phone)
      };

      // Check if any validation failed
      const hasErrors = Object.values(validations).some((result: any) => !result.isValid);
      
      if (hasErrors) {
        const firstError = Object.values(validations).find((result: any) => !result.isValid);
        setError(firstError?.errors[0] || 'Validation failed');
        return;
      }

      const result = await register(
        validations.email.sanitizedValue!,
        password,
        validations.name.sanitizedValue!,
        validations.phone.sanitizedValue!
      );

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  // Handle keyboard navigation and focus trapping
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
    }
    
    // Focus trapping: Tab key navigation
    if (event.key === 'Tab') {
      if (!modalRef.current) return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (event.shiftKey) {
        // Shift + Tab: move backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);

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
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleClose]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md transform transition-all duration-300 scale-100"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div 
          className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden"
          role="document"
        >
          {/* Header */}
          <ModalHeader 
            isLogin={isLogin} 
            onClose={handleClose}
            ref={firstFocusableRef}
          />

          {/* Error Display */}
          {error && (
            <div 
              className="mx-8 mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm"
              role="alert"
              aria-live="polite"
              id="login-error-message"
            >
              {error}
            </div>
          )}

          {/* Form */}
          {isLogin ? (
            <LoginForm 
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />
          ) : (
            <RegisterForm 
              onSubmit={handleRegister}
              loading={loading}
              error={error}
            />
          )}

          {/* Social Login */}
          <SocialLogin />

          {/* Toggle Mode */}
          <ToggleMode 
            isLogin={isLogin} 
            onToggle={handleToggleMode}
            ref={lastFocusableRef}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
