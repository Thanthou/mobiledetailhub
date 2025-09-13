import React from 'react';
import { MapPin } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { ServiceArea } from '../types';
import LocationSearch from './LocationSearch';

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
  apiLoaded,
}) => {
  const handleLocationSelect = (place: { city: string; state: string; zipCode: string }) => {
    onLocationUpdate('city', place.city);
    onLocationUpdate('state', place.state);
    onLocationUpdate('zip', parseInt(place.zipCode) || null);
    onEditModeChange(false);
  };

  const handleCancel = () => {
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
          <LocationSearch
            apiLoaded={apiLoaded}
            onLocationSelect={handleLocationSelect}
            onCancel={handleCancel}
            placeholder="Enter city or ZIP code"
            label="Search for a city or ZIP code"
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{primaryServiceArea.city}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                <span className="text-white">{primaryServiceArea.state}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                <span className="text-white">{primaryServiceArea.zip || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => onEditModeChange(true)}
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
