/**
 * CheckboxField - Checkbox input primitive
 * Consistent styling for checkbox inputs with labels
 * No network calls - pure presentational component
 */

import React from 'react';

import { cn } from '@/shared/utils';

export interface CheckboxFieldProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | string[];
  disabled?: boolean;
  helperText?: string;
  className?: string;
  id?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  error,
  disabled = false,
  helperText,
  className = '',
  id,
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = !!errorMessage;
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => { onChange(e.target.checked); }}
          disabled={disabled}
          className={cn(
            'mt-1 w-4 h-4 rounded border transition-colors',
            'bg-stone-700 border-stone-600',
            'checked:bg-orange-500 checked:border-orange-500',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900',
            hasError && 'border-red-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <label 
          htmlFor={checkboxId}
          className={cn(
            'ml-3 text-sm text-gray-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      </div>
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-400 ml-7">{helperText}</p>
      )}
      
      {hasError && (
        <p className="text-sm text-red-400 ml-7">{errorMessage}</p>
      )}
    </div>
  );
};

