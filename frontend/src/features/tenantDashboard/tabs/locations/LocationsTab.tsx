import React, { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';

import type { DetailerData } from '@/features/tenantDashboard/types';

import { addServiceArea, deleteServiceArea,saveServiceAreas } from '../../api/locationsApi';
import { useTenantBusinessData } from '../../hooks/useTenantBusinessData';
import { AddLocationModal } from './components/AddLocationModal';
import { DeleteLocationModal } from './components/DeleteLocationModal';
import PrimaryServiceArea from './components/PrimaryServiceArea';
import ServiceAreasList from './components/ServiceAreasList';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useLocationState } from './hooks/useLocationState';
import type { ServiceArea } from './types';

interface LocationsTabProps {
  detailerData?: DetailerData;
}

const LocationsTab: React.FC<LocationsTabProps> = () => {
  const { apiLoaded } = useGoogleMaps();
  
  const {
    primaryServiceArea,
    otherServiceAreas,
    loading,
    error,
    refetch
  } = useTenantBusinessData();

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
  

  // Group other service areas by state
  const locationsByState = useMemo(() => {
    const grouped: Record<string, ServiceArea[]> = {};
    
    otherServiceAreas.forEach(location => {
      const state = location.state.toUpperCase();
      if (state && !grouped[state]) {
        grouped[state] = [];
      }
      if (state && grouped[state]) {
        grouped[state].push(location);
      }
    });
    
    // Sort locations within each state by city
    Object.keys(grouped).forEach(state => {
      if (grouped[state]) {
        grouped[state].sort((a, b) => a.city.localeCompare(b.city));
      }
    });
    
    return grouped;
  }, [otherServiceAreas]);

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

  // Get current tenant slug (you'll need to get this from context/URL)
  const currentTenantSlug = 'jps'; // TODO: Get from tenant context

  // Helper function to update primary service area
  const updatePrimaryServiceAreaField = async (field: keyof ServiceArea, value: string | number) => {
    if (!primaryServiceArea) return;
    
    try {
      const updatedArea = { ...primaryServiceArea, [field]: value };
      const allServiceAreas = [updatedArea, ...otherServiceAreas];
      await saveServiceAreas(currentTenantSlug, allServiceAreas);
      
      // Refresh the data to show updated values
      refetch();
    } catch (error) {
      console.error('Error updating primary service area:', error);
      throw error;
    }
  };

  // Handle adding new location
  const handleAddLocation = async (locationData: { city: string; state: string; zip?: string; minimum: number; multiplier: number }) => {
    try {
      await addServiceArea(currentTenantSlug, locationData);
      setIsAddModalOpen(false);
      
      // Refresh the data to show new location
      refetch();
      return { success: true };
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  // Handle deleting location
  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteServiceArea(currentTenantSlug, locationToDelete.id);
      closeDeleteModal();
      
      // Refresh the data to show updated list
      refetch();
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle location update
  const handleLocationUpdate = async (locationId: string, field: keyof ServiceArea, value: string | number) => {
    try {
      const allServiceAreas = [...(primaryServiceArea ? [primaryServiceArea] : []), ...otherServiceAreas];
      const updatedAreas = allServiceAreas.map(area => 
        area.id === locationId ? { ...area, [field]: value } : area
      );
      await saveServiceAreas(currentTenantSlug, updatedAreas);
      
      // Refresh the data to show updated values
      refetch();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
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
            <h2 className="text-2xl font-bold text-white">Service Locations</h2>
            <p className="text-gray-400 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-400">Loading locations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Service Locations</h2>
            <p className="text-gray-400 mt-1">Manage the areas where you provide services</p>
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-300">Error Loading Locations</h3>
              <p className="text-sm text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Service Area */}
      {primaryServiceArea && (
        <PrimaryServiceArea
          primaryServiceArea={primaryServiceArea}
          isEditMode={isPrimaryEditMode}
          onEditModeChange={setIsPrimaryEditMode}
          onLocationUpdate={(field, value) => { void updatePrimaryServiceAreaField(field, value); }}
          apiLoaded={apiLoaded}
        />
      )}

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
        onLocationUpdate={(id, field, value) => { void handleLocationUpdate(id, field, value); }}
        onDeleteLocation={openDeleteModal}
        onLocationSelect={(place) => { void handleServiceAreaLocationSelect(place); }}
      />

      {/* Modals */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); }}
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
