/**
 * PhoneField - Phone number input with auto-formatting
 * Uses shared formatPhoneNumber utility
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn, formatPhoneNumber } from '@/shared/utils';

export interface PhoneFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '(555) 123-4567',
  required = false,
  disabled = false,
  helperText,
  className = '',
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete="tel"
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-colors',
          'bg-stone-700 text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-stone-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
      
      {hasError && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
};

