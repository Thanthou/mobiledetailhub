/**
 * Booking Async Operations Hook
 * Handles all async operations for booking functionality
 * Separated from Zustand store to maintain clean separation of concerns
 */

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBookingStore } from '../state/bookingStore';
import type { BookingData, BookingStep } from '../state/types';

export interface BookingValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BookingSubmissionResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export const useBookingAsync = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Get store actions
  const { 
    setLoading, 
    setErrors, 
    addError, 
    clearErrors,
    // bookingData 
  } = useBookingStore();

  /**
   * Validate booking data for a specific step
   */
  const validateBookingStep = useCallback((step: BookingStep, data: Partial<BookingData>): BookingValidationResult => {
    const errors: string[] = [];

    switch (step) {
      case 'vehicle-selection':
        if (!data.vehicle) {
          errors.push('Please select a vehicle type');
        }
        if (!data.vehicleDetails?.make || !data.vehicleDetails.model || !data.vehicleDetails.year) {
          errors.push('Please provide complete vehicle details');
        }
        break;

      case 'location':
        if (!data.location?.address || !data.location.city || !data.location.state) {
          errors.push('Please provide complete location information');
        }
        break;

      case 'service-tier':
        if (!data.serviceTier) {
          errors.push('Please select a service tier');
        }
        break;

      case 'addons':
        // Addons are optional, no validation needed
        break;

      case 'schedule':
        if (!data.schedule?.dates || data.schedule.dates.length === 0) {
          errors.push('Please select at least one date');
        }
        if (!data.schedule?.time) {
          errors.push('Please select a time slot');
        }
        break;

      case 'payment':
        if (!data.paymentMethod) {
          errors.push('Please select a payment method');
        }
        break;

      default:
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Validate entire booking data
   */
  const validateBooking = useCallback((data: BookingData): BookingValidationResult => {
    const allErrors: string[] = [];
    
    // Validate each step
    const steps: BookingStep[] = ['vehicle-selection', 'location', 'service-tier', 'addons', 'schedule', 'payment'];
    
    for (const step of steps) {
      const stepResult = validateBookingStep(step, data);
      allErrors.push(...stepResult.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }, [validateBookingStep]);

  /**
   * Submit booking for processing
   */
  const submitBooking = useCallback(async (data: BookingData): Promise<BookingSubmissionResult> => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setLoading(true);
    clearErrors();

    try {
      // Validate booking data
      const validation = validateBooking(data);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return {
          success: false,
          error: 'Please fix the validation errors before submitting'
        };
      }

      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        const bookingId = `booking_${Date.now()}`;
        return {
          success: true,
          bookingId
        };
      } else {
        throw new Error('Booking submission failed. Please try again.');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setSubmissionError(errorMessage);
      addError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [validateBooking, setLoading, setErrors, addError, clearErrors]);

  /**
   * Save booking data to server (draft)
   */
  const saveBookingDraft = useCallback(async (_data: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate success
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      addError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addError]);

  /**
   * Load booking data from server
   */
  const loadBookingData = useCallback(async (_bookingId: string): Promise<BookingData | null> => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, return null (no saved data)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load booking data';
      addError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addError]);

  /**
   * Check if booking data has unsaved changes
   */
  const hasUnsavedChanges = useCallback((currentData: BookingData): boolean => {
    // Simple check - in a real app, you'd compare with the last saved version
    return Object.values(currentData).some(value => {
      if (typeof value === 'string') return value.length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value as Record<string, unknown>).some(v => {
          if (typeof v === 'string') return v.length > 0;
          if (Array.isArray(v)) return v.length > 0;
          return false;
        });
      }
      return false;
    });
  }, []);

  return {
    // State
    isSubmitting,
    submissionError,
    
    // Actions
    validateBookingStep,
    validateBooking,
    submitBooking,
    saveBookingDraft,
    loadBookingData,
    hasUnsavedChanges,
  };
};

/**
 * Hook for booking data persistence
 */
export const useBookingPersistence = () => {
  const { bookingData } = useBookingStore();
  const { hasUnsavedChanges, saveBookingDraft } = useBookingAsync();

  // Auto-save booking data every 30 seconds
  const { data: autoSaveEnabled } = useQuery({
    queryKey: ['booking','autoSave'],
    queryFn: async () => {
      if (hasUnsavedChanges(bookingData)) {
        await saveBookingDraft(bookingData);
      }
      return true;
    },
    refetchInterval: 30000, // 30 seconds
    enabled: hasUnsavedChanges(bookingData),
  });

  return {
    autoSaveEnabled,
    hasUnsavedChanges: hasUnsavedChanges(bookingData),
  };
};
