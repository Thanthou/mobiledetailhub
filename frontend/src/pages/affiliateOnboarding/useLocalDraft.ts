// No React hooks needed for this utility

import type { AffiliateApplication } from './types';

const STORAGE_KEY = 'affiliate-application-draft';

export const useLocalDraft = () => {
  const saveDraft = (data: Partial<AffiliateApplication>) => {
    try {
      // Validate data before saving to prevent corruption
      const validatedData = Object.keys(data).reduce<Partial<AffiliateApplication>>((acc, key) => {
        const value = data[key as keyof AffiliateApplication];
        // Only save valid, non-empty data
        if (typeof value === 'string' && value.trim() !== '') {
          (acc as Record<string, unknown>)[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          (acc as Record<string, unknown>)[key] = value;
        } else if (typeof value === 'boolean') {
          (acc as Record<string, unknown>)[key] = value;
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Handle nested objects like base_location
          const nestedObj = value as Record<string, unknown>;
          if (Object.values(nestedObj).some(v => typeof v === 'string' && v.trim() !== '')) {
            (acc as Record<string, unknown>)[key] = value;
          }
        }
        return acc;
      }, {});
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedData));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = (): Partial<AffiliateApplication> | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) as Partial<AffiliateApplication> : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  // Emergency cleanup function to clear all potentially corrupted data
  const emergencyCleanup = () => {
    try {
      // Clear the main draft
      localStorage.removeItem(STORAGE_KEY);
      
      // Also clear any other potentially related keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('affiliate') || key.includes('draft') || key.includes('form'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        // Removed potentially corrupted key
      });
      
              // Emergency cleanup completed
      
      // Force a page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Failed to perform emergency cleanup:', error);
    }
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    emergencyCleanup
  };
};
