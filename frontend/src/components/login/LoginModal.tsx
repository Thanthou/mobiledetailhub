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

interface RateLimitInfo {
  retryAfterSeconds: number;
  remainingAttempts: number;
  resetTime: number;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && rateLimitInfo) {
      setRateLimitInfo(null);
      setError('');
    }
  }, [countdown, rateLimitInfo]);

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    setRateLimitInfo(null);

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
        // Handle specific error types from AuthContext
        if (result.error?.includes('Rate limited')) {
          // Extract retry info from error message or use default
          const retryMatch = result.error.match(/(\d+)/);
          const retrySeconds = retryMatch ? parseInt(retryMatch[1]) : 300; // Default 5 minutes
          
          setRateLimitInfo({
            retryAfterSeconds: retrySeconds,
            remainingAttempts: 0,
            resetTime: Date.now() + (retrySeconds * 1000)
          });
          setCountdown(retrySeconds);
          setError(`Too many login attempts. Please try again in ${retrySeconds} seconds.`);
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err: any) {
      // Handle rate limiting specifically
      if (err.code === 'RATE_LIMITED' && err.retryAfterSeconds) {
        setRateLimitInfo({
          retryAfterSeconds: err.retryAfterSeconds,
          remainingAttempts: err.remainingAttempts || 0,
          resetTime: err.resetTime || Date.now() + (err.retryAfterSeconds * 1000)
        });
        setCountdown(err.retryAfterSeconds);
        setError(`Too many login attempts. Please try again in ${err.retryAfterSeconds} seconds.`);
      } else if (err.code === 'INVALID_CREDENTIALS') {
        setError('Email or password is incorrect.');
      } else if (err.code === 'FORBIDDEN') {
        setError('Access denied. Please contact support.');
      } else if (err.message?.includes('Network') || err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, phone: string) => {
    setError('');
    setLoading(true);
    setRateLimitInfo(null);

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
        // Handle specific error types from AuthContext
        if (result.error?.includes('Rate limited')) {
          // Extract retry info from error message or use default
          const retryMatch = result.error.match(/(\d+)/);
          const retrySeconds = retryMatch ? parseInt(retryMatch[1]) : 300; // Default 5 minutes
          
          setRateLimitInfo({
            retryAfterSeconds: retrySeconds,
            remainingAttempts: 0,
            resetTime: Date.now() + (retrySeconds * 1000)
          });
          setCountdown(retrySeconds);
          setError(`Too many registration attempts. Please try again in ${retrySeconds} seconds.`);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      // Handle rate limiting specifically
      if (err.code === 'RATE_LIMITED' && err.retryAfterSeconds) {
        setRateLimitInfo({
          retryAfterSeconds: err.retryAfterSeconds,
          remainingAttempts: err.remainingAttempts || 0,
          resetTime: err.resetTime || Date.now() + (err.retryAfterSeconds * 1000)
        });
        setCountdown(err.retryAfterSeconds);
        setError(`Too many registration attempts. Please try again in ${err.retryAfterSeconds} seconds.`);
      } else if (err.message?.includes('Network') || err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setRateLimitInfo(null);
    setCountdown(0);
  };

  const handleClose = () => {
    setError('');
    setRateLimitInfo(null);
    setCountdown(0);
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

  // Format countdown display
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
              {rateLimitInfo && countdown > 0 && (
                <div className="mt-2 text-center">
                  <div className="text-lg font-mono font-bold text-orange-400">
                    {formatCountdown(countdown)}
                  </div>
                  <div className="text-xs text-red-200">
                    Try again in {countdown} seconds
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {isLogin ? (
            <LoginForm 
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
            />
          ) : (
            <RegisterForm 
              onSubmit={handleRegister}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
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
