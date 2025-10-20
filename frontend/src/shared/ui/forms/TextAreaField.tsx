/**
 * TextAreaField - Multi-line text input
 * Reusable textarea with validation and error display
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn } from '@shared/utils';

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  textareaClassName?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  rows = 4,
  maxLength,
  className = '',
  textareaClassName = '',
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  const charCount = value.length;
  const showCharCount = maxLength !== undefined;
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        {showCharCount && (
          <span className="text-xs text-gray-400">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-colors resize-y',
          'bg-stone-700 text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-stone-600',
          disabled && 'opacity-50 cursor-not-allowed',
          textareaClassName
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

