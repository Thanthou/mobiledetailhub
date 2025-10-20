import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@shared/hooks';

import { validateLoginRequest, validateRegisterRequest } from '../schemas/auth.schemas';
import { RateLimitInfo } from '../types';

export const useAuthModal = (onClose: () => void) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

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

  const handleLogin = useCallback(async (email: string, password: string) => {
    setError('');
    setLoading(true);
    setRateLimitInfo(null);

    try {
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
  }, [login, onClose]);

  const handleRegister = useCallback(async (email: string, password: string, name: string, phone: string) => {
    setError('');
    setLoading(true);
    setRateLimitInfo(null);

    try {
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
  }, [register, onClose]);

  const handleToggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setError('');
    setRateLimitInfo(null);
    setCountdown(0);
  }, [isLogin]);

  const handleClose = useCallback(() => {
    setError('');
    setRateLimitInfo(null);
    setCountdown(0);
    onClose();
  }, [onClose]);

  return {
    isLogin,
    error,
    loading,
    rateLimitInfo,
    countdown,
    handleLogin,
    handleRegister,
    handleToggleMode,
    handleClose
  };
};
