import React from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { Button } from '@/shared/ui';

import FormField from './FormField';
import RememberForgotSection from './RememberForgotSection';
import { useLoginFormValidation } from './LoginFormValidation';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string;
  disabled?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, disabled = false }) => {
  const {
    formData,
    handleSubmit,
    handleInputChange,
    getFieldError
  } = useLoginFormValidation({ onSubmit, disabled });
  
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  const passwordRightElement = (
    <Button
      type="button"
      onClick={togglePasswordVisibility}
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
        <RememberForgotSection disabled={disabled} />

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
