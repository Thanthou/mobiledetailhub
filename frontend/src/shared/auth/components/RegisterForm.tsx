import React from 'react';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';

import { Button } from '@shared/ui';

import { useRegisterForm } from '../hooks/useRegisterForm';
import { RegisterFormProps } from '../types';
import FormField from './FormField';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, disabled = false }) => {
  const {
    formData,
    showPassword,
    handleSubmit,
    handleInputChange,
    getFieldError,
    togglePasswordVisibility
  } = useRegisterForm({ onSubmit, disabled });


  const passwordRightElement = (
    <Button
      type="button"
      onClick={togglePasswordVisibility}
      variant="ghost"
      size="sm"
      className="text-gray-500 hover:text-gray-300"
      disabled={disabled}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </Button>
  );

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="px-8 pb-8">
      <div className="space-y-6">
        {/* Name Field */}
        <FormField
          id="name"
          name="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          icon={User}
          error={getFieldError('name')}
          required
          disabled={disabled}
          autocomplete="name"
        />

        {/* Phone Field */}
        <FormField
          id="phone"
          name="phone"
          label="Phone (optional)"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          icon={Phone}
          error={getFieldError('phone')}
          disabled={disabled}
          autocomplete="tel"
        />

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
          autocomplete="new-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          loading={loading}
          disabled={loading || disabled}
        >
          {disabled ? 'Rate limited' : 'Create account'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
