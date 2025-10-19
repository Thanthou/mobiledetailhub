import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react';

import { isValidStateCode } from '@/shared';
import { Button } from '@/shared/ui';

import type { ServiceArea } from '../types';

interface ServiceAreasListProps {
  locationsByState: Record<string, ServiceArea[]>;
  stateNames: string[];
  expandedStates: Set<string>;
  isEditMode: boolean;
  editingLocationId: string | null;
  apiLoaded: boolean;
  onToggleStateExpansion: (state: string) => void;
  onEditModeChange: (editMode: boolean) => void;
  onStartEditingLocation: (locationId: string) => void;
  onStopEditingLocation: () => void;
  onLocationUpdate: (locationId: string, field: keyof ServiceArea, value: string | number) => void;
  onDeleteLocation: (location: ServiceArea) => void;
  onLocationSelect: (place: { city: string; state: string; zipCode: string }) => void;
}

const ServiceAreasList: React.FC<ServiceAreasListProps> = ({
  locationsByState,
  stateNames,
  expandedStates,
  isEditMode,
  editingLocationId,
  apiLoaded: _apiLoaded,
  onToggleStateExpansion,
  onEditModeChange,
  onStartEditingLocation,
  onStopEditingLocation,
  onLocationUpdate,
  onDeleteLocation,
  onLocationSelect,
}) => {
  const [errors, setErrors] = useState<Record<string, { state?: string }>>({});
  
  // Form state for adding new location
  const [newLocationForm, setNewLocationForm] = useState({
    city: '',
    state: '',
    zip: ''
  });

  const handleStateChange = (locationId: string, value: string) => {
    const upperValue = value.toUpperCase();
    onLocationUpdate(locationId, 'state', upperValue);
    
    // Clear error when user starts typing
    if (errors[locationId]?.state) {
      setErrors(prev => ({
        ...prev,
        [locationId]: { ...prev[locationId], state: undefined }
      }));
    }
  };

  const handleNewLocationInputChange = (field: 'city' | 'state' | 'zip', value: string) => {
    const processedValue = field === 'state' ? value.toUpperCase() : value;
    setNewLocationForm(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSave = (locationId: string, location: ServiceArea) => {
    // Validate state
    if (!isValidStateCode(location.state)) {
      setErrors(prev => ({
        ...prev,
        [locationId]: { state: 'Please enter a valid 2-letter state code (e.g., CA, NY, TX)' }
      }));
      return;
    }
    
    // Clear errors and stop editing
    setErrors(prev => {
      const { [locationId]: _removed, ...newErrors } = prev;
      return newErrors;
    });
    onStopEditingLocation();
  };
  const _handleLocationSelect = (place: { city: string; state: string; zipCode: string }) => {
    onLocationSelect(place);
    onEditModeChange(false);
  };

  const handleCancel = () => {
    // Reset form when canceling
    setNewLocationForm({ city: '', state: '', zip: '' });
    onEditModeChange(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-orange-500">Service Areas</h3>
          {stateNames.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => { onToggleStateExpansion('expand-all'); }}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-orange-500"
              >
                Expand All
              </Button>
              <span className="text-gray-300">|</span>
              <Button
                onClick={() => { onToggleStateExpansion('collapse-all'); }}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-orange-500"
              >
                Collapse All
              </Button>
            </div>
          )}
        </div>
        {!isEditMode && (
          <Button
            onClick={() => { onEditModeChange(true); }}
            variant="primary"
            size="md"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-sm font-medium rounded-lg"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Location
          </Button>
        )}
      </div>
      
      {isEditMode && (
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="new-location-city" className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                <input
                  id="new-location-city"
                  type="text"
                  value={newLocationForm.city}
                  onChange={(e) => { handleNewLocationInputChange('city', e.target.value); }}
                  className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <label htmlFor="new-location-state" className="block text-sm font-medium text-gray-300 mb-1">State *</label>
                <input
                  id="new-location-state"
                  type="text"
                  value={newLocationForm.state}
                  onChange={(e) => { handleNewLocationInputChange('state', e.target.value); }}
                  className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="CA, NY, TX"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="new-location-zip" className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                <input
                  id="new-location-zip"
                  type="text"
                  value={newLocationForm.zip}
                  onChange={(e) => { handleNewLocationInputChange('zip', e.target.value); }}
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
                onClick={() => {
                  // Validate form
                  if (!newLocationForm.city.trim()) {
                    alert('Please enter a city');
                    return;
                  }
                  if (!newLocationForm.state.trim()) {
                    alert('Please enter a state');
                    return;
                  }
                  if (!isValidStateCode(newLocationForm.state)) {
                    alert('Please enter a valid 2-letter state code (e.g., CA, NY, TX)');
                    return;
                  }
                  
                  // Call onLocationSelect with actual form data
                  const formData = {
                    city: newLocationForm.city.trim(),
                    state: newLocationForm.state.trim(),
                    zipCode: newLocationForm.zip.trim()
                  };
                  onLocationSelect(formData);
                  
                  // Reset form
                  setNewLocationForm({ city: '', state: '', zip: '' });
                }}
                variant="primary"
                size="sm"
                className="px-4 py-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* State-organized Service Areas */}
      {stateNames.length > 0 ? (
        <div className="space-y-3">
          {stateNames.map((state) => {
            const stateLocations = locationsByState[state];
            const isExpanded = expandedStates.has(state);
            const locationCount = stateLocations?.length || 0;
            
            return (
              <div key={state} className="bg-stone-800 border border-stone-700 rounded-lg overflow-hidden">
                {/* State Header */}
                <button
                  onClick={() => { onToggleStateExpansion(state); }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-orange-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-orange-500" />
                    )}
                    <h4 className="text-lg font-semibold text-white">{state}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {locationCount} {locationCount === 1 ? 'location' : 'locations'}
                    </span>
                  </div>
                </button>
                
                {/* State Locations */}
                {isExpanded && stateLocations && (
                  <div className="border-t border-stone-700">
                    <div className="p-6 space-y-4">
                      {stateLocations.map((location, index) => {
                        const locationId = `${location.city}-${location.state}`;
                        const isEditingThisLocation = editingLocationId === locationId;
                        
                        return (
                          <div key={`${location.city}-${location.state}-${(index + 1).toString()}`} className="bg-stone-700 border border-stone-600 rounded-lg p-4">
                            {isEditingThisLocation ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label htmlFor={`edit-city-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                                    <input
                                      id={`edit-city-${locationId}`}
                                      type="text"
                                      value={location.city}
                                      onChange={(e) => { onLocationUpdate(locationId, 'city', e.target.value); }}
                                      className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      placeholder="Enter city name"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-state-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">State *</label>
                                    <input
                                      id={`edit-state-${locationId}`}
                                      type="text"
                                      value={location.state}
                                      onChange={(e) => { handleStateChange(locationId, e.target.value); }}
                                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                        errors[locationId]?.state ? 'border-red-500 bg-red-900/20' : 'border-stone-700 bg-stone-700'
                                      } text-white`}
                                      placeholder="CA, NY, TX"
                                      maxLength={2}
                                    />
                                    {errors[locationId]?.state && (
                                      <p className="mt-1 text-sm text-red-400">{errors[locationId].state}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label htmlFor={`edit-zip-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                                    <input
                                      id={`edit-zip-${locationId}`}
                                      type="text"
                                      value={location.zip || ''}
                                      onChange={(e) => { onLocationUpdate(locationId, 'zip', e.target.value); }}
                                      className="w-full px-3 py-2 border border-stone-700 bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      placeholder="12345 or 12345-6789"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                  <Button
                                    onClick={onStopEditingLocation}
                                    variant="secondary"
                                    size="sm"
                                    className="px-4 py-2"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => { handleSave(locationId, location); }}
                                    variant="primary"
                                    size="sm"
                                    className="px-4 py-2"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                  <label htmlFor={`readonly-city-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                  <input
                                    id={`readonly-city-${locationId}`}
                                    type="text"
                                    value={location.city}
                                    readOnly
                                    onClick={() => { onStartEditingLocation(locationId); }}
                                    className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                    title="Click to edit location"
                                  />
                                </div>
                                <div>
                                  <label htmlFor={`readonly-state-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                  <input
                                    id={`readonly-state-${locationId}`}
                                    type="text"
                                    value={location.state}
                                    readOnly
                                    onClick={() => { onStartEditingLocation(locationId); }}
                                    className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                    title="Click to edit location"
                                  />
                                </div>
                                <div>
                                  <label htmlFor={`readonly-zip-${locationId}`} className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                                  <input
                                    id={`readonly-zip-${locationId}`}
                                    type="text"
                                    value={location.zip || 'N/A'}
                                    readOnly
                                    onClick={() => { onStartEditingLocation(locationId); }}
                                    className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-600 text-white cursor-pointer hover:bg-stone-500 transition-colors"
                                    title="Click to edit location"
                                  />
                                </div>
                                <div className="lg:col-span-2 flex items-end">
                                  <Button
                                    onClick={() => { onDeleteLocation(location); }}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                                    title="Delete location"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-6 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Service Areas</h3>
          <p className="text-gray-500">Add locations where you provide services to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceAreasList;
