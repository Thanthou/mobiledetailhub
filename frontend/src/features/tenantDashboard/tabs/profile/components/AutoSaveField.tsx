import React from 'react';

import { AutoSaveInput } from '@/shared/ui';
import { formatPhoneNumber } from '@/shared/utils';

import { useAutoSaveField } from '../hooks/useAutoSaveField';
import type { BusinessData } from '../types';

interface AutoSaveFieldProps {
  field: keyof BusinessData;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date';
  placeholder?: string;
  className?: string;
  debounce?: number;
}

/**
 * Auto-save field component for tenant dashboard forms
 * Uses shared AutoSaveInput component with feature-specific auto-save logic
 */
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

  const handleChange = (newValue: string) => {
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

  return (
    <AutoSaveInput
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
      isSaving={isSaving}
      error={error}
      placeholder={placeholder}
      className={className}
    />
  );
};
