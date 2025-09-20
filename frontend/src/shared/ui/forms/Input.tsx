/* eslint-disable react/prop-types */
import React from 'react';

import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
    
    const baseStyles = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-input',
      filled: 'border-transparent bg-muted',
      outlined: 'border-2 border-input',
    };

    const inputClasses = cn(
      baseStyles,
      variants[variant],
      error && 'border-destructive focus-visible:ring-destructive',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
