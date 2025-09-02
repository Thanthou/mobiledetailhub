import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { VehicleSelector } from './components/VehicleSelector';
import { CategorySelector } from './components/CategorySelector';
import { ServiceSelector } from './components/ServiceSelector';

import { MultiTierPricingModal } from './components/MultiTierPricingModal';
import { DeleteServiceModal } from './components/DeleteServiceModal';
import { useServicesData, useServicesAPI } from './hooks/useServicesData';
import { useAuth } from '../../../../contexts/AuthContext';
import type { Service } from './types';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

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

  // Get affiliate ID from AuthContext or URL params for admin users
  const { user } = useAuth();
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // For affiliate users, get ID from auth context
  // For admin users, we'll need to fetch affiliate ID from the business slug
  const [adminAffiliateId, setAdminAffiliateId] = useState<string | null>(null);
  
  // Skip affiliate lookup for now - we'll rebuild the services structure
  // useEffect(() => {
  //   // Only fetch if user is admin and we have a business slug
  //   if (user?.role === 'admin' && businessSlug && !adminAffiliateId) {
  //     const fetchAffiliateId = async () => {
  //       try {
  //         const response = await fetch(`/api/affiliates/${businessSlug}`);
  //         
  //         if (response.ok) {
  //           const data = await response.json();
  //           
  //           if (data.success && data.affiliate?.id) {
  //             setAdminAffiliateId(data.affiliate.id.toString());
  //           }
  //         }
  //       } catch (error) {
  //         // Error handled silently
  //       }
  //     };
  //     fetchAffiliateId();
  //   }
  // }, [user?.role, businessSlug, adminAffiliateId]);
  
  // Skip affiliate ID for now - we'll rebuild the services structure
  const affiliateId = undefined; // user?.affiliate_id?.toString() || adminAffiliateId || undefined;

  const { vehicles } = useServicesData();
  
  // Skip services API for now - we'll rebuild the services structure
  const servicesAPI = null; // useServicesAPI(affiliateId);
  const { fetchServices, fetchServiceById, createService, updateService, deleteService, loading, error } = servicesAPI || {};
  
  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && !loading && fetchServices && affiliateId) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches for the same combination
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        if (fetchServices) {
          fetchServices(selectedVehicle, selectedCategory).then((data: any) => {
            if (data && Array.isArray(data) && data.length > 0) {
              // Convert API data to frontend Service format
              const services = data.map((serviceData: any) => ({
                id: serviceData.id.toString(),
                name: serviceData.name,
                tiers: serviceData.tiers && serviceData.tiers.length > 0 ? serviceData.tiers.map((tier: any) => ({
                  id: tier.id.toString(),
                  name: tier.name,
                  price: tier.price,
                  duration: tier.duration,
                  features: tier.features || [], // Features are now stored as arrays
                  enabled: tier.enabled,
                  popular: tier.popular
                })) : []
              }));
              
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
          }).catch((err) => {
            setCurrentServiceData(null);
            setAvailableServices([]);
            setSelectedService('');
          });
        }
      }, 100); // 100ms delay
      
      // Cleanup timeout on unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
  }, [selectedVehicle, selectedCategory, fetchServices, loading, selectedService]);

  // Effect to trigger initial fetch when affiliateId becomes available
  useEffect(() => {
    // Only fetch if we have all required data and haven't fetched yet
    if (affiliateId && selectedVehicle && selectedCategory && !loading && availableServices.length === 0) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Only call fetchServices if it's available (not null)
      if (fetchServices) {
        fetchServices(selectedVehicle, selectedCategory).then((data: any) => {
          if (data && Array.isArray(data) && data.length > 0) {
            const services = data.map((serviceData: any) => ({
              id: serviceData.id.toString(),
              name: serviceData.name,
              tiers: serviceData.tiers && serviceData.tiers.length > 0 ? serviceData.tiers.map((tier: any) => ({
                id: tier.id.toString(),
                name: tier.name,
                price: tier.price,
                duration: tier.duration,
                features: tier.features,
                enabled: tier.enabled,
                popular: tier.popular
              })) : []
            }));
            
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
        }).catch((err) => {
          // Error handled silently
        });
      }
    }
  }, [affiliateId, selectedVehicle, selectedCategory, fetchServices, loading, availableServices.length]); // Depend on affiliateId and other required values

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
    if (currentServiceData && currentServiceData.tiers && currentServiceData.tiers.length > 0) {
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

  // Skip affiliate ID checks for now - we're rebuilding the services structure
  // if (user?.role === 'admin' && businessSlug && !affiliateId) {
  //   return (
  //     <div className="text-center py-12">
  //       <div className="text-gray-400 mb-4">Loading affiliate data...</div>
  //     </div>
  //   );
  // }

  // if (!affiliateId) {
  //   return (
  //     <div className="text-center py-12">
  //       <div className="text-red-400 mb-4">Configuration Error</div>
  //       <h3 className="text-lg font-medium text-white mb-2">Affiliate ID not found</h3>
  //       <p className="text-gray-400 mb-4">
  //         {user?.role === 'admin' 
  //           ? 'Unable to load affiliate data. Please check the URL and try again.'
  //           : 'Please log in again or contact support'
  //         }
  //       </p>
  //     </div>
  //   );
  // }

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

  const handleMultiTierSubmit = async (serviceName: string, tiers: any[]) => {
    if (isEditingService && currentServiceData && updateService) {
      // Handle editing existing service
      try {
        const serviceData = {
          name: serviceName,
          description: serviceName + ' service',
          base_price_cents: Math.round((tiers[0]?.price || 0) * 100),
          min_duration_min: tiers[0]?.duration || 60,
          tiers: tiers
        };
        
        const result = await updateService(currentServiceData.id, serviceData);
        
        if (result) {
          // Close modal
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
          
          // Refresh the services list
          setTimeout(async () => {
            if (fetchServices) {
              const servicesData = await fetchServices(selectedVehicle, selectedCategory);
              if (servicesData && Array.isArray(servicesData)) {
                // Convert API data to frontend Service format
                const services = servicesData.map((serviceData: any) => ({
                  id: serviceData.id.toString(),
                  name: serviceData.name,
                  tiers: serviceData.tiers && serviceData.tiers.length > 0 ? serviceData.tiers.map((tier: any) => ({
                    id: tier.id.toString(),
                    name: tier.name,
                    price: tier.price,
                    duration: tier.duration,
                    features: tier.features || [], // Features are now stored as arrays
                    enabled: tier.enabled,
                    popular: tier.popular
                  })) : []
                }));
                
                // Update the UI state
                setAvailableServices(services);
                
                // Update current service data
                const updatedService = services.find(s => s.id === currentServiceData.id);
                if (updatedService) {
                  setCurrentServiceData(updatedService);
                }
              }
            }
          }, 500);
        }
      } catch (err) {
        console.error('Error updating service:', err);
        // Close modal even on error to prevent getting stuck
        setIsMultiTierModalOpen(false);
        setIsEditingService(false);
      }
      return;
    }

    if (!createService) return;
    
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
        setTimeout(async () => {
          if (fetchServices) {
            const servicesData = await fetchServices(selectedVehicle, selectedCategory);
            if (servicesData && Array.isArray(servicesData)) {
              // Convert API data to frontend Service format
              const services = servicesData.map((serviceData: any) => ({
                id: serviceData.id.toString(),
                name: serviceData.name,
                tiers: serviceData.tiers && serviceData.tiers.length > 0 ? serviceData.tiers.map((tier: any) => ({
                  id: tier.id.toString(),
                  name: tier.name,
                  price: tier.price,
                  duration: tier.duration,
                  features: tier.features || [], // Features are now stored as arrays
                  enabled: tier.enabled,
                  popular: tier.popular
                })) : []
              }));
              
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
          }
        }, 500);
      }
    } catch (err) {
      console.error('Error creating service:', err);
      // Close modal even on error to prevent getting stuck
      setIsMultiTierModalOpen(false);
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
    } catch (err) {
      // Error handled by the hook
    }
  };



  const getVehicleDisplayName = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId)?.name || 'Unknown Vehicle';
  };

  const getCategoryDisplayName = (categoryId: string) => {
    return selectedVehicleData?.categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
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
              <button 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Edit Service"
                onClick={() => handleEditService()}
                disabled={!selectedService || !currentServiceData}
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                title="Add Service"
                onClick={() => {
                  setIsEditingService(false);
                  setIsMultiTierModalOpen(true);
                }}
              >
                <Plus className="h-5 w-5" />
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Service"
                onClick={() => setIsDeleteServiceModalOpen(true)}
                disabled={!selectedService || !currentServiceData}
              >
                <Trash2 className="h-5 w-5" />
              </button>
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
          
          {currentServiceData.tiers && currentServiceData.tiers.length > 0 ? (
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
                      {tier.features && tier.features.length > 0 && tier.features.some(f => f && f.trim() !== '') && (
                        <div className="text-sm text-gray-300">
                          <div className="font-medium mb-2">Features:</div>
                          <ul className="space-y-1 pl-4">
                            {tier.features.map((feature, featureIndex) => (
                              feature && feature.trim() !== '' && (
                                <li key={featureIndex} className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">•</span>
                                  <span>{feature}</span>
                                </li>
                              )
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

      {/* Service Tier Cards */}
      {!affiliateId && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Initializing...</div>
        </div>
      )}
      
      {loading && affiliateId && servicesAPI && (
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
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Services Structure Rebuild</h3>
          <p className="text-gray-400 mb-4">We're rebuilding the services database structure. The services section will be available once the new tables are created.</p>
          <div className="text-sm text-gray-500">
            <p>Current status: Database schema migration in progress</p>
            <p>Next steps: Create new services and service_tiers tables</p>
          </div>
        </div>
      )}

             {/* Multi-Tier Pricing Modal */}
       <MultiTierPricingModal
         key={`${isEditingService ? 'edit' : 'create'}-${currentServiceData?.id || 'new'}-${isMultiTierModalOpen}`}
         isOpen={isMultiTierModalOpen}
         onClose={() => {
           setIsMultiTierModalOpen(false);
           setIsEditingService(false);
         }}
         onSubmit={handleMultiTierSubmit}
         initialTiers={isEditingService ? initialTiers : undefined}
         initialServiceName={isEditingService ? currentServiceData?.name || '' : ''}
         loading={loading || false}
         error={error}
       />

       {/* Delete Service Modal */}
       <DeleteServiceModal
         isOpen={isDeleteServiceModalOpen}
         onClose={() => setIsDeleteServiceModalOpen(false)}
         onConfirm={handleDeleteService}
         serviceName={currentServiceData?.name || ''}
         loading={loading || false}
       />
    </div>
  );
};

export default ServicesTab;