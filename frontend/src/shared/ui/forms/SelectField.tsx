/**
 * SelectField - Shared dropdown/select primitive
 * Reusable select input with validation and error display
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn } from '@/shared/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  error?: string | string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  selectClassName?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  helperText,
  className = '',
  selectClassName = '',
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  
  // Normalize options to SelectOption format
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-colors',
          'bg-stone-700 text-white',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-stone-600',
          disabled && 'opacity-50 cursor-not-allowed',
          selectClassName
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {normalizedOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
      
      {hasError && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
};

