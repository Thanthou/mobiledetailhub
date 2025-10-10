/**
 * PriceInput - Currency input with formatting
 * Handles price in cents (backend format) but displays as dollars
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn, parseCurrency } from '@/shared/utils';

export interface PriceInputProps {
  label: string;
  value: number;  // Price in cents
  onChange: (cents: number) => void;
  error?: string | string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: number;  // Minimum in cents
  max?: number;  // Maximum in cents
  className?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '0.00',
  required = false,
  disabled = false,
  helperText,
  min,
  max,
  className = '',
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  
  // Display value in dollars
  const displayValue = value ? (value / 100).toFixed(2) : '';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty
    if (!inputValue) {
      onChange(0);
      return;
    }
    
    // Parse to cents
    const dollars = parseCurrency(inputValue);
    const cents = Math.round(dollars * 100);
    
    // Apply min/max constraints
    let finalValue = cents;
    if (min !== undefined && cents < min) finalValue = min;
    if (max !== undefined && cents > max) finalValue = max;
    
    onChange(finalValue);
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-400">$</span>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full pl-8 pr-3 py-2 rounded-md border transition-colors',
            'bg-stone-700 text-white placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            hasError ? 'border-red-500' : 'border-stone-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
      
      {hasError && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
};

