import { useCallback, useEffect, useRef } from 'react';

import type { TenantApplication } from '../types';

interface UseAutoSaveOptions {
  formData: TenantApplication;
  enabled?: boolean;
  interval?: number;
}

const STORAGE_KEY = 'tenant_application_draft';

export const useAutoSave = ({
  formData,
  enabled = true,
  interval = 2000,
}: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [formData]);

  const performSave = useCallback(() => {
    const currentData = JSON.stringify(formData);

    if (currentData === lastSavedRef.current) {
      return;
    }

    saveToLocalStorage();
    lastSavedRef.current = currentData;
  }, [formData, saveToLocalStorage]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSave();
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, enabled, interval, performSave]);

  const loadFromLocalStorage = useCallback((): TenantApplication | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as TenantApplication) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }, []);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, []);

  return {
    loadFromLocalStorage,
    clearSavedData,
  };
};

