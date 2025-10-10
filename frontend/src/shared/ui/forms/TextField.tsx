/**
 * TextField - Shared form primitive
 * Reusable text input with validation and error display
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn } from '@/shared/utils';

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | string[];
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'password';
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  helperText,
  className = '',
  inputClassName = '',
  autoComplete,
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-colors',
          'bg-stone-700 text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-stone-600',
          disabled && 'opacity-50 cursor-not-allowed',
          inputClassName
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

