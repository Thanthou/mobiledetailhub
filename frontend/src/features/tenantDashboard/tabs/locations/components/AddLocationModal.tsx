import React, { useCallback, useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';

import { Button } from '@/shared/ui';
import { isValidStateCode } from '@/shared';

import type { LocationFormData, LocationValidationErrors } from '../types';


interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (location: LocationFormData) => Promise<{ success: boolean; error?: string }>;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState<LocationFormData>({
    city: '',
    state: '',
    zip: '',
    minimum: 0,
    multiplier: 1.0
  });
  const [errors, setErrors] = useState<LocationValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const validateForm = useCallback((): boolean => {
    const newErrors: LocationValidationErrors = {};

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!isValidStateCode(formData.state)) {
      newErrors.state = 'Please enter a valid 2-letter state code (e.g., CA, NY, TX)';
    }

    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 5 digits or 5+4 format';
    }

    if (formData.minimum < 0) {
      newErrors.minimum = 'Minimum must be a positive number';
    }

    if (formData.multiplier <= 0) {
      newErrors.multiplier = 'Multiplier must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onAdd(formData);
      
      if (result.success) {
        setFormData({ city: '', state: '', zip: '', minimum: 0, multiplier: 1.0 });
        setErrors({});
        onClose();
      } else {
        setErrors({ general: result.error || 'Failed to add location' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onAdd, onClose, validateForm]);

  const handleInputChange = (field: keyof LocationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Add Service Location</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter city name"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="CA, NY, TX"
                maxLength={2}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                id="zip"
                type="text"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.zip ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="12345 or 12345-6789"
              />
              {errors.zip && (
                <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
              )}
            </div>
          </div>

          {/* Pricing fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minimum" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum
              </label>
              <input
                type="number"
                id="minimum"
                value={formData.minimum || ''}
                onChange={(e) => { handleInputChange('minimum', parseFloat(e.target.value) || 0); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.minimum ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.minimum && (
                <p className="mt-1 text-sm text-red-600">{errors.minimum}</p>
              )}
            </div>

            <div>
              <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-1">
                Multiplier
              </label>
              <input
                type="number"
                id="multiplier"
                value={formData.multiplier || ''}
                onChange={(e) => { handleInputChange('multiplier', parseFloat(e.target.value) || 1.0); }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.multiplier ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1.00"
                step="0.01"
                min="0.01"
              />
              {errors.multiplier && (
                <p className="mt-1 text-sm text-red-600">{errors.multiplier}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
              loading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Location
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
