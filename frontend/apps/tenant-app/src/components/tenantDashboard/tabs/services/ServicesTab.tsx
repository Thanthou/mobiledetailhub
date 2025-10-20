/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- Complex service management with dynamic data structures */
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@shared/hooks';

import { CategorySelector } from './components/CategorySelector';
import { DeleteServiceModal } from './components/DeleteServiceModal';
import { MultiTierPricingModal } from './components/MultiTierPricingModal';
import { SelectedServiceDisplay } from './components/SelectedServiceDisplay';
import { ServiceActionsHeader } from './components/ServiceActionsHeader';
import { ServiceSelector } from './components/ServiceSelector';
import { VehicleSelector } from './components/VehicleSelector';
import { useServiceOperations } from './hooks/useServiceOperations';
import { useServicesAPI, useServicesData } from './hooks/useServicesData';
import { useServiceSelection } from './hooks/useServiceSelection';
import { useTenantId } from './hooks/useTenantId';
import {
  convertTierToNewFormat,
  convertTierToOldFormat,
  removeServiceFromTierGroup,
} from './types/ServiceFeature';

// Fallback empty data for features
const CAR_SERVICE_OPTIONS: Array<{ id: string; name: string }> = [];

const ServicesTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('cars');
  const [selectedCategory, setSelectedCategory] = useState<string>('service-packages');
  const [isMultiTierModalOpen, setIsMultiTierModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);

  // Get auth context and business slug
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // Resolve affiliate ID (handles both affiliate users and admin users)
  const tenantId = useTenantId();

  // Get vehicles data and API
  const { vehicles } = useServicesData();
  const api = useServicesAPI(tenantId);
  const { fetchServices, loading, error } = api;
  
  // Service selection and data management
  const {
    selectedService,
    setSelectedService,
    currentServiceData,
    setCurrentServiceData,
    availableServices,
    setAvailableServices
  } = useServiceSelection({
    selectedVehicle,
    selectedCategory,
    tenantId,
    fetchServices
  });

  // Service operations (CRUD)
  const operations = useServiceOperations(api, tenantId, selectedVehicle, selectedCategory);

  // Get selected vehicle and category data
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedCategoryData = selectedVehicleData?.categories.find(c => c.id === selectedCategory);

  // Memoize initialTiers to prevent infinite re-renders
  const initialTiers = useMemo(() => {
    if (currentServiceData?.tiers && currentServiceData.tiers.length > 0) {
      return currentServiceData.tiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        features: tier.features,
        enabled: tier.enabled,
        popular: tier.popular || false
      }));
    }
    return undefined;
  }, [currentServiceData]);

  // Handle removing features from tiers
  const handleRemoveFeature = (serviceId: string, currentTierId: string, groupTierName: string) => {
    if (currentServiceData) {
      const tierToUpdate = currentServiceData.tiers.find(tier => `tier-${tier.id}` === currentTierId);
      if (tierToUpdate) {
        const newFormatTier = convertTierToNewFormat(tierToUpdate);
        const updatedNewFormatTiers = removeServiceFromTierGroup([newFormatTier], newFormatTier.id, groupTierName, serviceId);
        const updatedOldFormatTier = convertTierToOldFormat(updatedNewFormatTiers[0]);
        
        const updatedTiers = currentServiceData.tiers.map(tier => 
          tier.id === tierToUpdate.id ? updatedOldFormatTier : tier
        );
        
        setCurrentServiceData({
          ...currentServiceData,
          tiers: updatedTiers
        });
      }
    }
  };

  // Loading state for admin users
  if (user?.role === 'admin' && businessSlug && !tenantId) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading affiliate data...</div>
      </div>
    );
  }

  // Error state for missing affiliate ID
  if (!tenantId) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Configuration Error</div>
        <h3 className="text-lg font-medium text-white mb-2">Affiliate ID not found</h3>
        <p className="text-gray-400 mb-4">
          {user?.role === 'admin' 
            ? 'Unable to load affiliate data. Please check the URL and try again.'
            : 'Please log in again or contact support'
          }
        </p>
      </div>
    );
  }

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.categories.length > 0) {
      setSelectedCategory(vehicle.categories[0]?.id || 'service-packages');
      setSelectedService('');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedService('');
  };

  const handleEditService = () => {
    if (currentServiceData) {
      setIsEditingService(true);
      setIsMultiTierModalOpen(true);
    }
  };

  const handleMultiTierSubmit = async (serviceName: string, tiers: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
    enabled: boolean;
    popular?: boolean;
  }>) => {
    try {
      let updatedServices;
      
      if (isEditingService && currentServiceData) {
        updatedServices = await operations.handleUpdateService(currentServiceData.id, serviceName, tiers);
      } else {
        updatedServices = await operations.handleCreateService(serviceName, tiers);
      }
      
      if (updatedServices) {
        setAvailableServices(updatedServices);
        
        if (isEditingService && currentServiceData) {
          const updatedService = updatedServices.find(s => s.id === currentServiceData.id);
          if (updatedService) {
            setCurrentServiceData(updatedService);
          }
        } else if (updatedServices.length > 0) {
          const newService = updatedServices[0];
          if (newService) {
            setCurrentServiceData(newService);
            setSelectedService(newService.id);
          }
        }
        
        setIsMultiTierModalOpen(false);
        setIsEditingService(false);
      }
    } catch (err: unknown) {
      console.error('Error saving service:', err);
      setIsMultiTierModalOpen(false);
      setIsEditingService(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService || !currentServiceData) return;
    
    try {
      const success = await operations.handleDeleteService(selectedService);
      if (success) {
        setIsDeleteServiceModalOpen(false);
        
        const updatedServices = availableServices.filter(service => service.id !== selectedService);
        setAvailableServices(updatedServices);
        setCurrentServiceData(null);
        setSelectedService('');
        
        if (updatedServices.length > 0) {
          const firstService = updatedServices[0];
          if (firstService) {
            setSelectedService(firstService.id);
            setCurrentServiceData(firstService);
          }
        }
      }
    } catch (err: unknown) {
      console.error('Error deleting service:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Unified Three Column Container with Action Buttons */}
      <div className="bg-stone-800 rounded-lg border border-stone-700 overflow-hidden">
        <ServiceActionsHeader
          onEditService={handleEditService}
          onAddService={() => {
            setIsEditingService(false);
            setIsMultiTierModalOpen(true);
          }}
          onDeleteService={() => { setIsDeleteServiceModalOpen(true); }}
          hasSelectedService={!!(selectedService && currentServiceData)}
        />
        
        <div className="grid grid-cols-[200px_200px_200px_auto] gap-0 min-h-[400px]">
          <div>
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleChange={handleVehicleChange}
            />
          </div>
          
          <div>
            <CategorySelector
              categories={selectedVehicleData?.categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <div>
            <ServiceSelector
              services={availableServices}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
          </div>
          <div></div>
        </div>
      </div>

      {/* Selected Service Display */}
      {currentServiceData && (
        <SelectedServiceDisplay
          service={currentServiceData}
          availableFeatures={CAR_SERVICE_OPTIONS}
          onRemoveFeature={handleRemoveFeature}
        />
      )}

      {/* Loading States */}
      {!tenantId && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Initializing...</div>
        </div>
      )}
      
      {loading && tenantId && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Loading services...</div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">Error: {error}</div>
        </div>
      )}

      {/* Empty State */}
      {availableServices.length === 0 && !loading && !error && selectedCategoryData && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            No services configured for this category yet.
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Add Your First Service</h3>
          <p className="text-gray-400 mb-4">Click the + button above to create your first service and pricing tiers.</p>
        </div>
      )}

      {/* Multi-Tier Pricing Modal */}
      <MultiTierPricingModal
        key={`${isEditingService ? 'edit' : 'create'}-${currentServiceData?.id || 'new'}`}
        isOpen={isMultiTierModalOpen}
        onClose={() => {
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
        }}
        onSubmit={(serviceName, tiers) => void handleMultiTierSubmit(serviceName, tiers)}
        initialTiers={isEditingService ? initialTiers : undefined}
        initialServiceName={isEditingService ? currentServiceData?.name || '' : ''}
        loading={loading || false}
        error={error}
        vehicleType={selectedVehicle}
        categoryType={selectedCategory as 'service-packages' | 'addons'}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal
        isOpen={isDeleteServiceModalOpen}
        onClose={() => { setIsDeleteServiceModalOpen(false); }}
        onConfirm={() => { void handleDeleteService(); }}
        serviceName={currentServiceData?.name || ''}
        loading={loading || false}
      />
    </div>
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- End of complex service management section */

export default ServicesTab;
