import { formatPhoneNumber, getPhoneDigits } from '../../../../../utils/fields/phoneFormatter';
import { useAutoSave } from '../../../../../utils/fields/useAutoSave';
import type { ProfileFormData } from '../types';
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
  field: keyof ProfileFormData;
}

export function useAutoSaveField(options: UseAutoSaveFieldOptions) {
  const { debounce = 1000, field } = options;
  const { updateProfile, profileData } = useProfileData();
  
  // Get the initial value for this field
  const getInitialValue = () => {
    if (!profileData) return '';
    
    switch (field) {
      case 'personal_phone':
      case 'business_phone':
        return profileData[field] ? formatPhoneNumber(profileData[field]) : '';
      case 'twilio_phone':
        return profileData[field] ? formatTwilioPhone(profileData[field]) : '';
      case 'business_start_date':
        return profileData[field] ? 
          new Date(profileData[field]).toISOString().split('T')[0] : '';
      default:
        return profileData[field] || '';
    }
  };

  const saveField = async (value: string) => {
    if (!profileData) return;
    
    // For phone fields, strip formatting before saving to database
    let saveValue = value;
    if (field === 'personal_phone' || field === 'business_phone') {
      saveValue = getPhoneDigits(value);
    } else if (field === 'twilio_phone') {
      saveValue = getTwilioPhoneDigits(value);
    }
    
    // Create a partial update object with just this field
    const updateData = { [field]: saveValue };
    
    const result = await updateProfile(updateData);
    if (!result.success) {
      throw new Error(result.error || 'Failed to save field');
    }
  };

  return useAutoSave(getInitialValue(), saveField, { debounce });
}
