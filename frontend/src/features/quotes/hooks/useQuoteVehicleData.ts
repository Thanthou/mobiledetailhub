import { useEffect } from 'react';

import { useVehicleData } from '@/shared/hooks';

import { type QuoteFormData } from '../types';

/**
 * Hook to manage vehicle data and dependencies
 * Handles vehicle type, make, model relationships
 */
export const useQuoteVehicleData = (formData: QuoteFormData, updateFormData: (field: keyof QuoteFormData, value: string) => void) => {
  const { vehicleTypes, getMakes, getModels } = useVehicleData();

  // Get available makes and models based on selected vehicle type
  const availableMakes = formData.vehicleType ? getMakes(formData.vehicleType) : [];
  const availableModels = formData.vehicleType && formData.vehicleMake ?
    getModels(formData.vehicleType, formData.vehicleMake) : [];

  // Reset vehicle make and model when vehicle type changes
  useEffect(() => {
    if (formData.vehicleType) {
      updateFormData('vehicleMake', '');
      updateFormData('vehicleModel', '');
    }
  }, [formData.vehicleType, updateFormData]);

  // Reset vehicle model when vehicle make changes
  useEffect(() => {
    if (formData.vehicleMake) {
      updateFormData('vehicleModel', '');
    }
  }, [formData.vehicleMake, updateFormData]);

  return {
    vehicleTypes,
    availableMakes,
    availableModels
  };
};
