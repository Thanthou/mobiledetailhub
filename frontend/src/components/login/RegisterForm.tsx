import { Eye, EyeOff, Lock, Mail, Phone,User } from 'lucide-react';
import React, { useState } from 'react';

import FormField from './FormField';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, name: string, phone: string) => Promise<void>;
  loading: boolean;
  error?: string;
  disabled?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    setFieldErrors({});

    // Basic validation
    const errors: Record<string, string[]> = {};
    
    if (!formData.name) {
      errors.name = ['Name is required'];
    } else if (formData.name.trim().length < 2) {
      errors.name = ['Name must be at least 2 characters'];
    }
    
    if (!formData.email) {
      errors.email = ['Email is required'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ['Please enter a valid email'];
    }
    
    if (!formData.password) {
      errors.password = ['Password is required'];
    } else if (formData.password.length < 6) {
      errors.password = ['Password must be at least 6 characters'];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await onSubmit(formData.email, formData.password, formData.name, formData.phone);
    } catch (err) {
      // Error handling is done by the parent component
      console.error('Registration failed:', err);
    }
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
    <button
      type="button"
      onClick={() => { setShowPassword(!showPassword); }}
      className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
      disabled={disabled}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
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
        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating account...
            </div>
          ) : disabled ? (
            'Rate limited'
          ) : (
            'Create account'
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
