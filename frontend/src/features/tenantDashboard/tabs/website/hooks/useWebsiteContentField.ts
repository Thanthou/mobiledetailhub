import type { WebsiteContentData } from '@/shared/api/websiteContent.api';
import { useAutoSave } from '@/shared/utils';

import { useWebsiteContent } from '../contexts/WebsiteContentContext';

type WebsiteContentField = keyof WebsiteContentData;

interface UseWebsiteContentFieldOptions {
  debounce?: number;
  field: WebsiteContentField;
}

export function useWebsiteContentField(options: UseWebsiteContentFieldOptions) {
  const { debounce = 1000, field } = options;
  const { updateContent, contentData } = useWebsiteContent();
  
  // Get the initial value for this field
  const getInitialValue = (): string => {
    if (!contentData) return '';
    const value = contentData[field];
    // Convert numbers to strings for the input field
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    return '';
  };

  const saveField = async (value: string) => {
    if (!contentData) return;
    
    // Convert string back to appropriate type for saving
    let saveValue: string | number = value;
    if (field === 'reviews_avg_rating') {
      saveValue = parseFloat(value) || 0;
    } else if (field === 'reviews_total_count') {
      saveValue = parseInt(value, 10) || 0;
    }
    
    // Create a partial update object with just this field
    const updateData = { [field]: saveValue };
    
    const success = await updateContent(updateData);
    if (!success) {
      throw new Error(`Failed to save ${field}`);
    }
  };

  return useAutoSave(getInitialValue(), saveField, { debounce });
}

