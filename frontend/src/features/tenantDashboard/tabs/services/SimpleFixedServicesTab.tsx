import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Settings, Trash2 } from 'lucide-react';

import { useAuth } from '@/shared/hooks';
import { Button } from '@/shared/ui';

import { CategorySelector } from './components/CategorySelector';
import { DeleteServiceModal } from './components/DeleteServiceModal';
import { MultiTierPricingModal } from './components/MultiTierPricingModal';
import { ServiceSelector } from './components/ServiceSelector';
import { VehicleSelector } from './components/VehicleSelector';
import { useServicesData } from './hooks/useServicesData';
import type { Service } from './types';

const SimpleFixedServicesTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('cars');
  const [selectedCategory, setSelectedCategory] = useState<string>('service-packages');
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentServiceData, setCurrentServiceData] = useState<Service | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isMultiTierModalOpen, setIsMultiTierModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Prevent infinite loops
  const lastFetchRef = React.useRef<string>('');
  
  // Get tenant ID from AuthContext or URL params for admin users
  const authContext = useAuth();
  const user = authContext.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // For tenant users, get ID from auth context
  // For admin users, we'll need to fetch tenant ID from the business slug
  const [adminTenantId, setAdminTenantId] = useState<string | null>(null);
  
  // Fetch tenant ID for admin users
  useEffect(() => {
    // Only fetch if user is admin and we have a business slug
    if (user?.role === 'admin' && businessSlug && !adminTenantId) {
      const fetchTenantId = async () => {
        try {
          const response = await fetch(`/api/tenants/${businessSlug}`);
          
          if (response.ok) {
            const data = await response.json() as {
              success: boolean;
              tenant?: {
                id: number;
              };
            };
            
            if (data.success && data.tenant?.id) {
              setAdminTenantId(data.tenant.id.toString());
            }
          }
        } catch (err: unknown) {
          console.error('Error fetching tenant ID:', err);
        }
      };
      void fetchTenantId();
    }
  }, [user?.role, businessSlug, adminTenantId]);
  
  // Get tenant ID from user context or admin lookup
  const tenantId = user?.tenant_id?.toString() ?? adminTenantId ?? undefined;

  const { vehicles } = useServicesData();
  
  // Direct API call function to avoid hook dependency issues
  const fetchServicesDirect = useCallback(async (vehicleId: string, categoryId: string) => {
    if (!tenantId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend IDs to database IDs
      const VEHICLE_ID_MAP: Record<string, number> = {
        'cars': 1,
        'suv': 3, // SUV has its own database ID
        'trucks': 2,
        'rvs': 4,
        'boats': 5,
        'motorcycles': 6,
        'offroad': 7,
        'other': 8
      };
      
      const CATEGORY_ID_MAP: Record<string, number> = {
        'interior': 1,
        'exterior': 2, 
        'service-packages': 3,
        'addons': 7,
        'ceramic-coating': 4,
        'paint-correction': 5,
        'paint-protection-film': 6
      };
      
      const dbVehicleId = VEHICLE_ID_MAP[vehicleId];
      const dbCategoryId = CATEGORY_ID_MAP[categoryId];
      
      if (!dbVehicleId || !dbCategoryId) {
        throw new Error('Invalid vehicle or category ID');
      }
      
      const response = await fetch(`/api/services/tenant/${tenantId}/vehicle/${vehicleId}/category/${dbCategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json() as { success: boolean; data: unknown[] };
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tenantId]);
  
  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && tenantId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}-${tenantId}`;
      
      // Prevent duplicate calls
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      void fetchServicesDirect(selectedVehicle, selectedCategory).then((data: unknown) => {
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
          
          // If no service is currently selected, select the first one
          if (!selectedService && services.length > 0) {
            const firstService = services[0];
            if (firstService) {
              setSelectedService(firstService.id);
              setCurrentServiceData(firstService);
            }
          } else if (selectedService) {
            // Find the currently selected service in the new list
            const currentService = services.find(s => s.id === selectedService);
            if (currentService) {
              setCurrentServiceData(currentService);
            } else if (services.length > 0) {
              // If the selected service is not in the new list, select the first one
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
      });
    }
  }, [selectedVehicle, selectedCategory, tenantId, fetchServicesDirect, selectedService]);

  // Effect to handle service selection changes
  useEffect(() => {
    if (selectedService && availableServices.length > 0) {
      const selectedServiceData = availableServices.find(service => service.id === selectedService);
      if (selectedServiceData) {
        setCurrentServiceData(selectedServiceData);
      }
    }
  }, [selectedService, availableServices]);

  // Add the missing variable declarations here
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedCategoryData = selectedVehicleData?.categories.find(c => c.id === selectedCategory);

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
      setSelectedService(''); // Reset service selection
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedService(''); // Reset service selection
  };

  const handleEditService = () => {
    if (currentServiceData) {
      setIsEditingService(true);
      setIsMultiTierModalOpen(true);
    }
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
                onClick={handleEditService}
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
                  setIsEditingService(false);
                  setIsMultiTierModalOpen(true);
                }}
                leftIcon={<Plus className="h-5 w-5" />}
              />
              <Button 
                variant="destructive"
                size="sm"
                className="p-2 bg-red-500 hover:bg-red-600"
                title="Delete Service"
                onClick={() => { setIsDeleteServiceModalOpen(true); }}
                disabled={!selectedService || !currentServiceData}
                leftIcon={<Trash2 className="h-5 w-5" />}
              />
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
              onServiceChange={setSelectedService}
            />
          </div>
          <div></div>
        </div>
      </div>

      {/* Selected Service Display */}
      {currentServiceData && (
        <div className="bg-stone-800 rounded-lg border border-stone-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Service: {currentServiceData.name}</h3>
          
          {currentServiceData.tiers.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-2">
                {currentServiceData.tiers.length} tier{currentServiceData.tiers.length !== 1 ? 's' : ''} configured:
              </div>
              <div className="space-y-4">
                {currentServiceData.tiers.map((tier, index) => (
                  <div key={tier.id} className="bg-stone-700 rounded-lg p-4 border border-stone-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{tier.name}</h4>
                      <span className="text-xs text-gray-400">Tier {index + 1}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-400">
                        ${Number(tier.price).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {tier.duration} minutes
                      </div>
                      {tier.features.length > 0 && (
                        <div className="text-sm text-gray-300">
                          <div className="font-medium mb-2">Features:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="text-gray-400">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        {tier.enabled && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                            Enabled
                          </span>
                        )}
                        {tier.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No tiers configured for this service.</div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Loading services...</div>
        </div>
      )}
      
      {/* Error State */}
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
        onSubmit={(_serviceName, _tiers) => {
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
        }}
        initialTiers={isEditingService ? currentServiceData?.tiers : undefined}
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
        onConfirm={() => {
          setIsDeleteServiceModalOpen(false);
        }}
        serviceName={currentServiceData?.name || ''}
        loading={loading || false}
      />
    </div>
  );
};

export default SimpleFixedServicesTab;
