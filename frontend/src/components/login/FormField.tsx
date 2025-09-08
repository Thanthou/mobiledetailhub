import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  error?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
  autocomplete?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  rightElement,
  autocomplete
}) => {
  const hasError = !!error;
  const errorId = `${id}-error`;
  
  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
      </label>
      <div className="relative">
        <div 
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <Icon size={18} className="text-gray-500" />
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 [color-scheme:dark] ${
            hasError 
              ? 'border-red-500 bg-red-950/20' 
              : 'border-stone-600 bg-stone-950'
          }`}
          placeholder={placeholder}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required}
          autoComplete={autocomplete}
        />
        {rightElement && (
          <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-hidden="true"
          >
            {rightElement}
          </div>
        )}
      </div>
      {hasError && (
        <p 
          id={errorId}
          className="text-sm text-red-400 mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
