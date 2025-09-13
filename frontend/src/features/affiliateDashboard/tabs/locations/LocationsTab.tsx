import React, { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';

import type { DetailerData } from '@/features/affiliateDashboard/types';

import { AddLocationModal } from './components/AddLocationModal';
import { DeleteLocationModal } from './components/DeleteLocationModal';
import PrimaryServiceArea from './components/PrimaryServiceArea';
import ServiceAreasList from './components/ServiceAreasList';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useLocationState } from './hooks/useLocationState';
import { useLocationsData } from './hooks/useLocationsData';
import type { ServiceArea } from './types';

interface LocationsTabProps {
  detailerData?: DetailerData;
}

const LocationsTab: React.FC<LocationsTabProps> = () => {
  const { apiLoaded } = useGoogleMaps();
  
  const {
    locations,
    loading,
    error,
    addLocation,
    removeLocation,
    updateLocationField
  } = useLocationsData();

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    locationToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    expandedStates,
    toggleStateExpansion,
    expandAllStates,
    collapseAllStates,
    editingLocationId,
    startEditingLocation,
    stopEditingLocation,
  } = useLocationState();

  // Primary service area edit state
  const [isPrimaryEditMode, setIsPrimaryEditMode] = useState(false);
  
  // Service area edit state
  const [isServiceAreaEditMode, setIsServiceAreaEditMode] = useState(false);

  // Get primary service area from locations data (where primary: true)
  const primaryServiceArea = locations.find(location => location.primary);

  // Group locations by state
  const locationsByState = useMemo(() => {
    const grouped: Record<string, ServiceArea[]> = {};
    
    locations.forEach(location => {
      if (!location.primary) { // Exclude primary service area from state grouping
        const state = location.state.toUpperCase();
        if (state && !grouped[state]) {
          grouped[state] = [];
        }
        if (state && grouped[state]) {
          grouped[state].push(location);
        }
      }
    });
    
    // Sort locations within each state by city
    Object.keys(grouped).forEach(state => {
      if (grouped[state]) {
        grouped[state].sort((a, b) => a.city.localeCompare(b.city));
      }
    });
    
    return grouped;
  }, [locations]);

  // Get sorted state names
  const stateNames = useMemo(() => {
    return Object.keys(locationsByState).sort();
  }, [locationsByState]);

  // Handle state expansion actions
  const handleToggleStateExpansion = (state: string) => {
    if (state === 'expand-all') {
      expandAllStates(stateNames);
    } else if (state === 'collapse-all') {
      collapseAllStates();
    } else {
      toggleStateExpansion(state);
    }
  };

  // Helper function to update primary service area
  const updatePrimaryServiceAreaField = (field: keyof ServiceArea, value: string | number) => {
    void updateLocationField('primary', field, value);
  };

  // Handle adding new location
  const handleAddLocation = async (locationData: { city: string; state: string; zip?: string; minimum: number; multiplier: number }) => {
    const result = await addLocation({
      city: locationData.city,
      state: locationData.state,
      zip: locationData.zip ? parseInt(locationData.zip) : null,
      primary: false,
      minimum: locationData.minimum,
      multiplier: locationData.multiplier,
    });
    
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      console.error('Failed to add location:', result.error);
    }
    
    return result;
  };

  // Handle deleting location
  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    
    setIsDeleting(true);
    try {
      const locationId = `${locationToDelete.city}-${locationToDelete.state}`;
      const result = await removeLocation(locationId);
      if (result.success) {
        closeDeleteModal();
      } else {
        console.error('Failed to delete location:', result.error);
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle location update
  const handleLocationUpdate = (locationId: string, field: keyof ServiceArea, value: string | number) => {
    void updateLocationField(locationId, field, value);
  };

  // Handle location select for service areas
  const handleServiceAreaLocationSelect = async (place: { city: string; state: string; zipCode: string }) => {
    await handleAddLocation({
      city: place.city,
      state: place.state,
      zip: place.zipCode,
      minimum: 0,
      multiplier: 1,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Locations</h2>
            <p className="text-gray-600 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Locations</h2>
            <p className="text-gray-600 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Locations</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Service Area */}
      <PrimaryServiceArea
        primaryServiceArea={primaryServiceArea}
        isEditMode={isPrimaryEditMode}
        onEditModeChange={setIsPrimaryEditMode}
        onLocationUpdate={updatePrimaryServiceAreaField}
        apiLoaded={apiLoaded}
      />

      {/* Service Areas */}
      <ServiceAreasList
        locationsByState={locationsByState}
        stateNames={stateNames}
        expandedStates={expandedStates}
        isEditMode={isServiceAreaEditMode}
        editingLocationId={editingLocationId}
        apiLoaded={apiLoaded}
        onToggleStateExpansion={handleToggleStateExpansion}
        onEditModeChange={setIsServiceAreaEditMode}
        onStartEditingLocation={startEditingLocation}
        onStopEditingLocation={stopEditingLocation}
        onLocationUpdate={handleLocationUpdate}
        onDeleteLocation={openDeleteModal}
        onLocationSelect={handleServiceAreaLocationSelect}
      />

      {/* Modals */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLocation}
      />

      <DeleteLocationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteLocation}
        location={locationToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default LocationsTab;
