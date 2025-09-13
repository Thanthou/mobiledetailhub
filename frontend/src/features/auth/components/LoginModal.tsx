import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAuth } from '@/shared/hooks';
import { validateLoginRequest, validateRegisterRequest } from '../schemas/auth.schemas';
import LoginForm from './LoginForm';
import ModalHeader from './ModalHeader';
import RegisterForm from './RegisterForm';
import SocialLogin from './SocialLogin';
import ToggleMode from './ToggleMode';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RateLimitInfo {
  retryAfterSeconds: number;
  remainingAttempts?: number;
  resetTime?: number;
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

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => { clearTimeout(timer); };
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
      // Validate input using Zod schemas
      const loginData = validateLoginRequest({ email, password });
      
      const result = await login(loginData.email, loginData.password);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, phone: string) => {
    setError('');
    setLoading(true);
    setRateLimitInfo(null);

    try {
      // Validate input using Zod schemas
      const registerData = validateRegisterRequest({ email, password, name, phone });
      
      const result = await register(registerData.email, registerData.password, registerData.name, registerData.phone);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
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

  const handleClose = useCallback(() => {
    setError('');
    setRateLimitInfo(null);
    setCountdown(0);
    onClose();
  }, [onClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
    }
  }, [handleClose]);

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
  }, [isOpen, handleClose, handleKeyDown]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => { setMounted(false); };
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
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onMouseDown={(e) => { e.preventDefault(); }}
        onMouseUp={(e) => { e.preventDefault(); }}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden"
          role="document"
        >
          {/* Header */}
          <ModalHeader 
            ref={firstFocusableRef}
            isLogin={isLogin} 
            onClose={handleClose} 
          />

          {/* Error Display */}
          {error && (
            <div 
              className="mx-8 mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm"
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
              onSubmit={(email, password) => { void handleLogin(email, password); }}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
            />
          ) : (
            <RegisterForm 
              onSubmit={(email, password, name, phone) => { void handleRegister(email, password, name, phone); }}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
            />
          )}

          {/* Social Login */}
          <SocialLogin />

          {/* Toggle Mode */}
          <ToggleMode 
            ref={firstFocusableRef}
            isLogin={isLogin} 
            onToggle={handleToggleMode} 
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
