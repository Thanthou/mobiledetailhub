import { useAutoSave } from '../../../../../utils/fields/useAutoSave';
import { useProfileData } from './useProfileData';

interface UseAutoSaveFieldOptions {
  debounce?: number;
  field: keyof import('../types').ProfileFormData;
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
        return profileData[field] || '';
      case 'business_start_date':
        return profileData[field] ? 
          new Date(profileData[field]).toISOString().split('T')[0] : '';
      default:
        return profileData[field] || '';
    }
  };

  const saveField = async (value: string) => {
    if (!profileData) return;
    
    // Create a partial update object with just this field
    const updateData = { [field]: value };
    
    const result = await updateProfile(updateData);
    if (!result.success) {
      throw new Error(result.error || 'Failed to save field');
    }
  };

  return useAutoSave(getInitialValue(), saveField, { debounce });
}
