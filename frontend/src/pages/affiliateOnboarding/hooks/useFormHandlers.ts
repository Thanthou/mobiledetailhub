import { useCallback } from 'react';
import { AffiliateApplication } from '../types';

export const useFormHandlers = (setFormData: React.Dispatch<React.SetStateAction<AffiliateApplication>>) => {
  const handleInputChange = useCallback((field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof AffiliateApplication] as object),
          [child]: value
        }
      }));
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
