import { useCallback } from 'react';

import type { AffiliateApplication } from '../types';

// Type for form field values
type FormValue = string | number | boolean | string[] | { city: string; state: string; zip: string };

// Type for nested field access
type NestedField = keyof AffiliateApplication;

// Type guard to check if a field is nested
const isNestedField = (field: string): field is `${NestedField}.${string}` => {
  return field.includes('.');
};

export const useFormHandlers = (setFormData: React.Dispatch<React.SetStateAction<AffiliateApplication>>) => {
  const handleInputChange = useCallback((field: string, value: FormValue) => {
    if (isNestedField(field)) {
      const [parent, child] = field.split('.') as [NestedField, string];
      setFormData(prev => {
        const parentValue = prev[parent] as Record<string, FormValue>;
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, [setFormData]);

  const handleArrayChange = useCallback((field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof AffiliateApplication] as string[];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  }, [setFormData]);

  return {
    handleInputChange,
    handleArrayChange
  };
};
