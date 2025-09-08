import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import React from 'react';

import { formatPhoneNumber } from '../../../../../utils/fields/phoneFormatter';
import { useAutoSaveField } from '../hooks/useAutoSaveField';
import type { ProfileFormData } from '../types';

interface AutoSaveFieldProps {
  field: keyof ProfileFormData;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date';
  placeholder?: string;
  className?: string;
  debounce?: number;
}

export const AutoSaveField: React.FC<AutoSaveFieldProps> = ({
  field,
  label,
  type = 'text',
  placeholder,
  className = '',
  debounce = 1000,
}) => {
  const { value, setValue, isSaving, error } = useAutoSaveField({ 
    field, 
    debounce 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Apply phone formatting for phone fields
    if (type === 'tel' && (field === 'personal_phone' || field === 'business_phone')) {
      const formatted = formatPhoneNumber(newValue);
      setValue(formatted);
    } else if (type === 'tel' && field === 'twilio_phone') {
      // For Twilio phone, we need to import the formatTwilioPhone function
      // For now, just set the value as-is and let the hook handle formatting
      setValue(newValue);
    } else {
      setValue(newValue);
    }
  };

  const getStatusIcon = () => {
    if (isSaving) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (value && value.trim() !== '') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-stone-600'
          } ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getStatusIcon()}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {isSaving && (
        <p className="mt-1 text-sm text-blue-400">Saving...</p>
      )}
    </div>
  );
};
