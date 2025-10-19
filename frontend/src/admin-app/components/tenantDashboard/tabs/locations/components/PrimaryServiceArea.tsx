import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

import { isValidStateCode } from '@/shared';
import { Button } from '@/shared/ui';

import type { ServiceArea } from '../types';

interface PrimaryServiceAreaProps {
  primaryServiceArea: ServiceArea | undefined;
  isEditMode: boolean;
  onEditModeChange: (editMode: boolean) => void;
  onLocationUpdate: (field: keyof ServiceArea, value: string | number) => void;
  apiLoaded: boolean;
}

const PrimaryServiceArea: React.FC<PrimaryServiceAreaProps> = ({
  primaryServiceArea,
  isEditMode,
  onEditModeChange,
  onLocationUpdate,
  apiLoaded: _apiLoaded,
}) => {
  const [errors, setErrors] = useState<{ state?: string }>({});

  const _handleLocationSelect = (place: { city: string; state: string; zipCode: string }) => {
    onLocationUpdate('city', place.city);
    onLocationUpdate('state', place.state);
    onLocationUpdate('zip', parseInt(place.zipCode) || null);
    onEditModeChange(false);
  };

  const handleCancel = () => {
    setErrors({});
    onEditModeChange(false);
  };

  const handleStateChange = (value: string) => {
    const upperValue = value.toUpperCase();
    onLocationUpdate('state', upperValue);
    
    // Clear error when user starts typing
    if (errors.state) {
      setErrors({});
    }
  };

  const handleSave = () => {
    if (!primaryServiceArea) return;
    
    // Validate state
    if (!isValidStateCode(primaryServiceArea.state)) {
      setErrors({ state: 'Please enter a valid 2-letter state code (e.g., CA, NY, TX)' });
      return;
    }
    
    // Clear errors and exit edit mode
    setErrors({});
    onEditModeChange(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-orange-500">Primary Service Area</h3>
      </div>
      
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        {!primaryServiceArea ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-600">No primary service area found</p>
          </div>
        ) : isEditMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="primary-city" className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                <input
                  id="primary-city"
                  type="text"
                  value={primaryServiceArea.city}
                  onChange={(e) => { onLocationUpdate('city', e.target.value); }}
                  className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <label htmlFor="primary-state" className="block text-sm font-medium text-gray-300 mb-1">State *</label>
                <input
                  id="primary-state"
                  type="text"
                  value={primaryServiceArea.state}
                  onChange={(e) => { handleStateChange(e.target.value); }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.state ? 'border-red-500 bg-red-900/20' : 'border-stone-700 bg-stone-700'
                  } text-white`}
                  placeholder="CA, NY, TX"
                  maxLength={2}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-400">{errors.state}</p>
                )}
              </div>
              <div>
                <label htmlFor="primary-zip" className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                <input
                  id="primary-zip"
                  type="text"
                  value={primaryServiceArea.zip || ''}
                  onChange={(e) => { onLocationUpdate('zip', e.target.value); }}
                  className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="12345 or 12345-6789"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleCancel}
                variant="secondary"
                size="sm"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="primary"
                size="sm"
                className="px-4 py-2"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="block text-sm font-medium text-gray-300 mb-1">City</div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{primaryServiceArea.city}</span>
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-300 mb-1">State</div>
                <span className="text-white">{primaryServiceArea.state}</span>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</div>
                <span className="text-white">{primaryServiceArea.zip || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => { onEditModeChange(true); }}
                variant="secondary"
                size="sm"
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-sm font-medium rounded-lg"
              >
                Edit Location
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimaryServiceArea;
