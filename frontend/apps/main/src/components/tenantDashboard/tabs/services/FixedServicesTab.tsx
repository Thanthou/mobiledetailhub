import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Settings, Trash2 } from 'lucide-react';

import { useAuth } from '@shared/hooks';
import { Button } from '@shared/ui';

import { CategorySelector } from './components/CategorySelector';
import { DeleteServiceModal } from './components/DeleteServiceModal';
import { MultiTierPricingModal } from './components/MultiTierPricingModal';
import { SelectedServiceDetailsDisplay } from './components/SelectedServiceDetailsDisplay';
import { ServiceSelector } from './components/ServiceSelector';
import { VehicleSelector } from './components/VehicleSelector';
import { useFixedServicesHandlers } from './hooks/useFixedServicesHandlers';
import { useServicesAPI, useServicesData } from './hooks/useServicesData';
import { useTenantId } from './hooks/useTenantId';
import type { Service } from './types';

const FixedServicesTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('cars');
  const [selectedCategory, setSelectedCategory] = useState<string>('service-packages');
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentServiceData, setCurrentServiceData] = useState<Service | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  
  const lastFetchRef = React.useRef<string>('');
  
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  const tenantId = useTenantId();
  const { vehicles } = useServicesData();
  const { fetchServices, createService, updateService, deleteService, loading, error } = useServicesAPI(tenantId);
  
  const handlers = useFixedServicesHandlers({
    availableServices,
    selectedService,
    currentServiceData,
    setSelectedService,
    setCurrentServiceData,
    setAvailableServices,
    updateService,
    deleteService,
    createService,
    fetchServices,
    selectedVehicle,
    selectedCategory,
  });
  
  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && tenantId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}-${tenantId}`;
      
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      void fetchServices(selectedVehicle, selectedCategory).then((data: unknown) => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Convert API data to frontend Service format
          const services = data.map((serviceData: unknown) => {
            const service = serviceData as {
              id: number;
              name: string;
              tiers?: Array<{
                id: number;
                name: string;
                price: number;
                duration: number;
                features?: string[];
                enabled: boolean;
                popular?: boolean;
              }>;
            };
            return {
              id: service.id.toString(),
              name: service.name,
              tiers: service.tiers && service.tiers.length > 0 ? service.tiers.map((tier) => ({
                id: tier.id.toString(),
                name: tier.name,
                price: tier.price,
                duration: tier.duration,
                features: tier.features || [],
                enabled: tier.enabled,
                popular: tier.popular || false
              })) : []
            };
          });
          
          setAvailableServices(services);
          
          if (!selectedService && services.length > 0) {
            const firstService = services[0];
            if (firstService) {
              setSelectedService(firstService.id);
              setCurrentServiceData(firstService);
            }
          } else if (selectedService) {
            const currentService = services.find(s => s.id === selectedService);
            if (currentService) {
              setCurrentServiceData(currentService);
            } else if (services.length > 0) {
              const firstService = services[0];
              if (firstService) {
                setSelectedService(firstService.id);
                setCurrentServiceData(firstService);
              }
            }
          }
        } else {
          setCurrentServiceData(null);
          setAvailableServices([]);
          setSelectedService('');
        }
      }).catch((err: unknown) => {
        console.error('Error fetching services:', err);
        setCurrentServiceData(null);
        setAvailableServices([]);
        setSelectedService('');
      });
    }
  }, [selectedVehicle, selectedCategory, tenantId, fetchServices, selectedService]);

  // Effect to handle service selection changes
  useEffect(() => {
    if (selectedService && availableServices.length > 0) {
      const selectedServiceData = availableServices.find(service => service.id === selectedService);
      if (selectedServiceData) {
        setCurrentServiceData(selectedServiceData);
      }
    }
  }, [selectedService, availableServices]);

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  if (user?.role === 'admin' && businessSlug && !tenantId) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading affiliate data...</div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Unified Three Column Container with Action Buttons */}
      <div className="bg-stone-800 rounded-lg border border-stone-700 overflow-hidden">
        {/* Header Row with Column Titles and Action Buttons */}
        <div className="p-4 border-b border-stone-700">
          <div className="grid grid-cols-[200px_200px_200px_auto] gap-0">
            <h3 className="text-lg font-semibold text-white px-4">Vehicle</h3>
            <h3 className="text-lg font-semibold text-white px-4">Category</h3>
            <h3 className="text-lg font-semibold text-white px-4">Service</h3>
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-white"
                title="Edit Service"
                onClick={handlers.handleEditService}
                disabled={!selectedService || !currentServiceData}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="primary"
                size="sm"
                className="p-2 bg-green-500 hover:bg-green-600"
                title="Add Service"
                onClick={() => {
                  handlers.setIsMultiTierModalOpen(true);
                }}
                leftIcon={<Plus className="h-5 w-5" />}
              />
              <Button 
                variant="destructive"
                size="sm"
                className="p-2 bg-red-500 hover:bg-red-600"
                title="Delete Service"
                onClick={() => { handlers.setIsDeleteServiceModalOpen(true); }}
                disabled={!selectedService || !currentServiceData}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
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
              onServiceChange={handlers.handleServiceChange}
            />
          </div>
          <div></div>
        </div>
      </div>

      <SelectedServiceDetailsDisplay currentServiceData={currentServiceData} />

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
      
      {error && tenantId && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">Error loading services</div>
          <p className="text-gray-400">{error}</p>
        </div>
      )}

      {/* Multi-Tier Pricing Modal */}
      <MultiTierPricingModal
        isOpen={handlers.isMultiTierModalOpen}
        onClose={() => {
          handlers.setIsMultiTierModalOpen(false);
        }}
        onSave={handlers.handleSaveService}
        vehicleType={selectedVehicle}
        categoryType={selectedCategory as 'service-packages' | 'addons'}
        editingService={handlers.isEditingService ? currentServiceData : null}
        loading={loading || false}
        error={error}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal
        isOpen={handlers.isDeleteServiceModalOpen}
        onClose={() => { handlers.setIsDeleteServiceModalOpen(false); }}
        onConfirm={() => { void handlers.handleDeleteService(); }}
        serviceName={currentServiceData?.name || ''}
        loading={loading || false}
      />
    </div>
  );
};

export default FixedServicesTab;
