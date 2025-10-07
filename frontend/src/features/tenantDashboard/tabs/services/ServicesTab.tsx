/* eslint-disable */
import { Plus, Settings, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/shared/ui';

import { useAuth } from '@/shared/hooks';
import { CategorySelector } from './components/CategorySelector';
import { DeleteServiceModal } from './components/DeleteServiceModal';
import { MultiTierPricingModal } from './components/MultiTierPricingModal';
import { ServiceSelector } from './components/ServiceSelector';
import { VehicleSelector } from './components/VehicleSelector';
import { useServicesAPI, useServicesData } from './hooks/useServicesData';
import type { Service } from './types';
// Disabled affiliate services import
// import { CAR_SERVICE_OPTIONS } from '@/data/affiliate-services/cars/service/features';

// Fallback empty data
const CAR_SERVICE_OPTIONS = [];
import { buildTierDisplayStructure, resolveServiceNames, removeServiceFromTierGroup, convertTierToNewFormat, convertTierToOldFormat, type ServiceFeature, type TierFeatureGroup } from './types/ServiceFeature';
import { FeatureList } from './components/FeatureList';

const ServicesTab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('cars');
  const [selectedCategory, setSelectedCategory] = useState<string>('service-packages');
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentServiceData, setCurrentServiceData] = useState<Service | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isMultiTierModalOpen, setIsMultiTierModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  
  // Prevent infinite loops
  const lastFetchRef = useRef<string>('');

  // Handle removing features from tiers
  const handleRemoveFeature = (serviceId: string, currentTierId: string, groupTierName: string) => {
    if (currentServiceData) {
      // Find the tier by ID (currentTierId is like "tier-142")
      const tierToUpdate = currentServiceData.tiers.find(tier => `tier-${tier.id}` === currentTierId);
      if (tierToUpdate) {
        // Convert to new format, remove service, then convert back
        const newFormatTier = convertTierToNewFormat(tierToUpdate);
        const updatedNewFormatTiers = removeServiceFromTierGroup([newFormatTier], newFormatTier.id, groupTierName, serviceId);
        const updatedOldFormatTier = convertTierToOldFormat(updatedNewFormatTiers[0]);
        
        // Update the tier in the service data
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

  // Get affiliate ID from AuthContext or URL params for admin users
  const authContext = useAuth();
  const user = authContext?.user;
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // For affiliate users, get ID from auth context
  // For admin users, we'll need to fetch affiliate ID from the business slug
  const [adminAffiliateId, setAdminAffiliateId] = useState<string | null>(null);
  
  // Fetch affiliate ID for admin users
  useEffect(() => {
    // Only fetch if user is admin and we have a business slug
    if (user?.role === 'admin' && businessSlug && !adminAffiliateId) {
      const fetchAffiliateId = async () => {
        try {
          const response = await fetch(`/api/affiliates/${businessSlug}`);
          
          if (response.ok) {
            const data = await response.json() as {
              success: boolean;
              affiliate?: {
                id: number;
              };
            };
            
            if (data.success && data.affiliate?.id) {
              setAdminAffiliateId(data.affiliate.id.toString());
            }
          }
        } catch (err: unknown) {
          console.error('Error fetching affiliate ID:', err);
        }
      };
      void fetchAffiliateId();
    }
  }, [user?.role, businessSlug, adminAffiliateId]);
  
  // Get affiliate ID from user context or admin lookup
  const affiliateId = user?.affiliate_id?.toString() ?? adminAffiliateId ?? undefined;

  const { vehicles } = useServicesData();
  
  // Use services API with proper affiliate ID
  const { fetchServices, createService, updateService, deleteService, loading, error } = useServicesAPI(affiliateId);
  
  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && affiliateId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches for the same combination
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
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
                    features: tier.features || [], // Features are now stored as arrays
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
          }).catch((err: unknown) => {
            console.error('Error fetching services:', err);
            setCurrentServiceData(null);
            setAvailableServices([]);
            setSelectedService('');
          });
      }, 100); // 100ms delay
      
      // Cleanup timeout on unmount or dependency change
      return () => { clearTimeout(timeoutId); };
    }
  }, [selectedVehicle, selectedCategory, fetchServices, affiliateId]);

  // Effect to trigger initial fetch when affiliateId becomes available
  useEffect(() => {
    // Only fetch if we have all required data and haven't fetched yet
    if (affiliateId && selectedVehicle && selectedCategory && availableServices.length === 0) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Only call fetchServices if it's available (not null)
      void fetchServices(selectedVehicle, selectedCategory).then((data: unknown) => {
          if (data && Array.isArray(data) && data.length > 0) {
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
                  popular: tier.popular
                })) : []
              };
            });
            
            setAvailableServices(services);
        
            // Select the first service by default
            if (services.length > 0) {
              const firstService = services[0];
              if (firstService) {
                setSelectedService(firstService.id);
                setCurrentServiceData(firstService);
              }
            }
          }
        }).catch((err: unknown) => {
          console.error('Error fetching services:', err);
        });
    }
  }, [affiliateId, selectedVehicle, selectedCategory, fetchServices, availableServices.length]);

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

  // Memoize initialTiers to prevent infinite re-renders - MUST be before any conditional returns
  const initialTiers = useMemo(() => {
    // If we have current service data with tiers, use it for editing
    if (currentServiceData?.tiers && currentServiceData.tiers.length > 0) {
      const mappedTiers = currentServiceData.tiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        features: tier.features,
        enabled: tier.enabled,
        popular: tier.popular || false
      }));
      return mappedTiers;
    }
    return undefined;
  }, [currentServiceData]);

  if (user?.role === 'admin' && businessSlug && !affiliateId) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading affiliate data...</div>
      </div>
    );
  }

  if (!affiliateId) {
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

  const handleMultiTierSubmit = async (serviceName: string, tiers: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
    enabled: boolean;
    popular?: boolean;
  }>) => {
    if (isEditingService && currentServiceData) {
      // Handle editing existing service
      try {
        // Map vehicle ID to backend format using shared utility
        const { getBackendEndpoint } = await import('@/shared/utils/vehicleMapping');
        
        // Map category ID to backend format
        const categoryMap: { [key: string]: number } = {
          'interior': 1,
          'exterior': 2,
          'service-packages': 3,
          'ceramic-coating': 4,
          'paint-correction': 5,
          'paint-protection-film': 6,
          'addons': 7
        };
        
        const serviceData = {
          affiliate_id: affiliateId,
          vehicle_id: getBackendEndpoint(selectedVehicle),
          service_category_id: categoryMap[selectedCategory] || 3,
          name: serviceName,
          description: serviceName + ' service',
          base_price_cents: Math.round((tiers[0]?.price || 0) * 100),
          tiers: tiers
        };
        
        const result = await updateService(currentServiceData.id, serviceData);
        
        if (result) {
          // Close modal
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
          
          // Refresh the services list
          setTimeout(() => {
            void fetchServices(selectedVehicle, selectedCategory).then((servicesData) => {
              if (servicesData && Array.isArray(servicesData)) {
                // Convert API data to frontend Service format
                const services = servicesData.map((serviceData: unknown) => {
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
                      features: tier.features || [], // Features are now stored as arrays
                      enabled: tier.enabled,
                      popular: tier.popular || false
                    })) : []
                  };
                });
                
                // Update the UI state
                setAvailableServices(services);
                
                // Update current service data
                const updatedService = services.find(s => s.id === currentServiceData.id);
                if (updatedService) {
                  setCurrentServiceData(updatedService);
                }
              }
            }).catch((err: unknown) => {
              console.error('Error refreshing services:', err);
            });
          }, 500);
        }
      } catch (err: unknown) {
        console.error('Error updating service:', err);
        // Close modal even on error to prevent getting stuck
        setIsMultiTierModalOpen(false);
        setIsEditingService(false);
      }
    } else {
      try {
      // Create a service with the provided service name
      const result = await createService(selectedVehicle, selectedCategory, serviceName, tiers);
      
      if (result) {
        // Close modal
        setIsMultiTierModalOpen(false);
        
        // TODO: After creating the service, we need to create the tiers
        // This will require updating the backend to handle tier creation
        // For now, we'll just refresh the services list
        
        // Add a small delay to ensure the database transaction is complete
        setTimeout(() => {
          void fetchServices(selectedVehicle, selectedCategory).then((servicesData) => {
            if (servicesData && Array.isArray(servicesData)) {
              // Convert API data to frontend Service format
              const services = servicesData.map((serviceData: unknown) => {
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
                    features: tier.features || [], // Features are now stored as arrays
                    enabled: tier.enabled,
                    popular: tier.popular || false
                  })) : []
                };
              });
              
              // Update the UI state
              setAvailableServices(services);
              
              // Select the newly created service
              if (services.length > 0) {
                const newService = services[0];
                if (newService) {
                  setCurrentServiceData(newService);
                  setSelectedService(newService.id);
                }
              }
            }
          }).catch((err: unknown) => {
            console.error('Error refreshing services:', err);
          });
        }, 500);
        }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } catch (err: unknown) {
        console.error('Error creating service:', err);
        // Close modal even on error to prevent getting stuck
        setIsMultiTierModalOpen(false);
      }
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService || !currentServiceData) return;
    
    try {
      const success = await deleteService(selectedService);
      if (success) {
        // Close modal
        setIsDeleteServiceModalOpen(false);
        
        // Remove the deleted service from the UI
        const updatedServices = availableServices.filter(service => service.id !== selectedService);
        setAvailableServices(updatedServices);
        
        // Clear current service data
        setCurrentServiceData(null);
        setSelectedService('');
        
        // If there are remaining services, select the first one
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
        {/* Header Row with Column Titles and Action Buttons */}
        <div className="p-4 border-b border-stone-700">
          <div className="grid grid-cols-[200px_200px_200px_auto] gap-0">
            <h3 className="text-lg font-semibold text-white px-4">Vehicle</h3>
            <h3 className="text-lg font-semibold text-white px-4">Category</h3>
            <h3 className="text-lg font-semibold text-white px-4">Service</h3>
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="ghost"
                size="icon"
                className="p-2 text-gray-400 hover:text-white"
                title="Edit Service"
                onClick={handleEditService}
                disabled={!selectedService || !currentServiceData}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="primary"
                size="icon"
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
                size="icon"
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
                        ${tier.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {tier.duration} minutes
                      </div>
                      {tier.features.length > 0 && (
                        <div className="text-sm text-gray-300">
                          <div className="font-medium mb-2">Features:</div>
                          <FeatureList 
                            features={resolveServiceNames(buildTierDisplayStructure(tier, currentServiceData?.tiers || [], CAR_SERVICE_OPTIONS), CAR_SERVICE_OPTIONS)}
                            tierNames={currentServiceData?.tiers?.map(t => t.name) || []}
                            onRemoveFeature={handleRemoveFeature}
                            showRemoveButtons={true}
                            currentTierId={`tier-${tier.id}`}
                            allTiers={currentServiceData?.tiers || []}
                          />
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

      {/* Service Tier Cards */}
      {!affiliateId && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Initializing...</div>
        </div>
      )}
      
      {loading && affiliateId && (
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
         onConfirm={() => void handleDeleteService()}
         serviceName={currentServiceData?.name || ''}
         loading={loading || false}
       />
    </div>
  );
};

export default ServicesTab;