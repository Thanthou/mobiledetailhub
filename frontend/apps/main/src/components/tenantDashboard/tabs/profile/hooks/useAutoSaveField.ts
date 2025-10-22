import { useEffect, useState } from 'react';
import { formatPhoneNumber, getPhoneDigits } from '@shared/utils';
import { useAutoSave } from '@shared/hooks/useAutoSave';

import type { BusinessData } from '../types';
import { useProfileData } from './useProfileData';

// Format Twilio phone number (keeps +1 prefix)
const formatTwilioPhone = (input: string): string => {
  if (!input) return '';
  
  // Remove all non-digit characters except +
  const cleaned = input.replace(/[^\d+]/g, '');
  
  // If it starts with +1, keep it
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    const digits = cleaned.slice(2); // Remove +1
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // If it's 10 digits, add +1
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If it's 11 digits starting with 1, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    const digits = cleaned.slice(1);
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return cleaned; // Return as-is if doesn't match expected patterns
};

// Get Twilio phone digits (keeps +1 prefix)
const getTwilioPhoneDigits = (input: string): string => {
  if (!input) return '';
  
  // Remove all non-digit characters except +
  const cleaned = input.replace(/[^\d+]/g, '');
  
  // If it starts with +1, keep it
  if (cleaned.startsWith('+1') && cleaned.length === 12) {
    return cleaned;
  }
  
  // If it's 10 digits, add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // If it's 11 digits starting with 1, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
};

interface UseAutoSaveFieldOptions {
  debounce?: number;
  field: keyof BusinessData;
}

export function useAutoSaveField(options: UseAutoSaveFieldOptions) {
  const { debounce = 1000, field } = options;
  const { updateBusiness, businessData } = useProfileData();
  
  // Get the current value for this field (reactive to businessData changes)
  const getCurrentValue = (): string => {
    if (!businessData) return '';
    
    switch (field) {
      case 'personal_phone':
      case 'business_phone':
        return businessData[field] ? formatPhoneNumber(businessData[field]) : '';
      case 'twilio_phone':
        return businessData[field] ? formatTwilioPhone(businessData[field]) : '';
      case 'business_start_date':
        return businessData[field] ? 
          new Date(businessData[field]).toISOString().split('T')[0] : '';
      default: {
        const value = businessData[field] as string | number | unknown[] | null | undefined;
        if (value === null || value === undefined || value === 'null' || value === '') {
          return '';
        }
        return typeof value === 'string' ? value : String(value);
      }
    }
  };

  // Create a reactive value that updates when businessData changes
  const [currentValue, setCurrentValue] = useState(() => getCurrentValue());
  
  useEffect(() => {
    setCurrentValue(getCurrentValue());
  }, [businessData, field]);

  const saveField = async (value: string) => {
    if (!businessData) return;
    
    // For phone fields, strip formatting before saving to database
    let saveValue = value;
    if (field === 'personal_phone' || field === 'business_phone') {
      saveValue = getPhoneDigits(value);
    } else if (field === 'twilio_phone') {
      saveValue = getTwilioPhoneDigits(value);
    }
    
    // Create a partial update object with just this field
    const updateData = { [field]: saveValue };
    
    const success = await updateBusiness(updateData);
    if (!success) {
      throw new Error(`Failed to save ${field}`);
    }
  };

  return useAutoSave(currentValue, saveField, { debounce });
}
