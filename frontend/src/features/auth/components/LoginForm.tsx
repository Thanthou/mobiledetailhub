import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { Button } from '@/shared/ui';

import FormField from './FormField';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string;
  disabled?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    setFieldErrors({});

    // Basic validation
    const errors: Record<string, string[]> = {};
    
    if (!formData.email) {
      errors.email = ['Email is required'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ['Please enter a valid email'];
    }
    
    if (!formData.password) {
      errors.password = ['Password is required'];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await onSubmit(formData.email, formData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  const passwordRightElement = (
    <Button
      type="button"
      onClick={() => { setShowPassword(!showPassword); }}
      variant="ghost"
      size="sm"
      className="text-gray-500 hover:text-gray-300 p-1"
      disabled={disabled}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </Button>
  );

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="px-8 pb-8">
      <div className="space-y-6">
        {/* Email Field */}
        <FormField
          id="email"
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          icon={Mail}
          error={getFieldError('email')}
          required
          disabled={disabled}
          autocomplete="email"
        />

        {/* Password Field */}
        <FormField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          icon={Lock}
          error={getFieldError('password')}
          required
          rightElement={passwordRightElement}
          disabled={disabled}
          autocomplete="current-password"
        />

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              className="w-4 h-4 text-orange-500 bg-stone-950 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
              disabled={disabled}
              autoComplete="off"
            />
            <span className="text-sm text-gray-300 ml-2">Remember me</span>
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-sm text-orange-400 hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed p-0 h-auto"
            disabled={disabled}
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-70 disabled:hover:scale-100"
          loading={loading}
          disabled={loading || disabled}
        >
          {disabled ? 'Rate limited' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
