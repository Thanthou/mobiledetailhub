import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { VehicleSelector } from './components/VehicleSelector';
import { CategorySelector } from './components/CategorySelector';
import { ServiceSelector } from './components/ServiceSelector';
import { ServiceTierCards } from './components/ServiceTierCards';
import { AddServiceModal } from './components/AddServiceModal';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('interior');
  const [selectedService, setSelectedService] = useState<string>('');
  const [currentServiceData, setCurrentServiceData] = useState<Service | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  
  // Prevent infinite loops
  const lastFetchRef = useRef<string>('');

  // Get affiliate ID from AuthContext or URL params for admin users
  const { user } = useAuth();
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // For affiliate users, get ID from auth context
  // For admin users, we'll need to fetch affiliate ID from the business slug
  const [adminAffiliateId, setAdminAffiliateId] = useState<string | null>(null);
  
  // Always call useEffect to maintain hook order consistency
  useEffect(() => {
    // Only fetch if user is admin and we have a business slug
    if (user?.role === 'admin' && businessSlug && !adminAffiliateId) {
      console.log('🔍 Admin user detected, fetching affiliate ID for slug:', businessSlug);
      const fetchAffiliateId = async () => {
        try {
          console.log('🔍 Fetching from:', `/api/affiliates/${businessSlug}`);
          const response = await fetch(`/api/affiliates/${businessSlug}`);
          console.log('🔍 Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 Response data:', data);
            
            if (data.success && data.affiliate?.id) {
              console.log('✅ Affiliate ID found:', data.affiliate.id);
              setAdminAffiliateId(data.affiliate.id.toString());
            } else {
              console.log('❌ No affiliate ID in response:', data);
            }
          } else {
            console.log('❌ Response not ok:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching affiliate ID for admin:', error);
        }
      };
      fetchAffiliateId();
    }
  }, [user?.role, businessSlug, adminAffiliateId]);
  
  // Use affiliate ID from user context, or fallback to admin-fetched ID
  const affiliateId = user?.affiliate_id?.toString() || adminAffiliateId || undefined;

  const { vehicles, toggleTierEnabled } = useServicesData();
  
  const { fetchServices, fetchServiceById, createService, loading, error } = useServicesAPI(affiliateId || '');
  
  // Effect to fetch services when vehicle or category changes
  useEffect(() => {
    if (selectedVehicle && selectedCategory && !loading) {
      const fetchKey = `${selectedVehicle}-${selectedCategory}`;
      
      // Prevent duplicate fetches for the same combination
      if (lastFetchRef.current === fetchKey) {
        return;
      }
      
      lastFetchRef.current = fetchKey;
      
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
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
                features: tier.features,
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
      }, 100); // 100ms delay
      
      // Cleanup timeout on unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
    }, [selectedVehicle, selectedCategory, fetchServices, loading, selectedService]);

  // Effect to trigger initial fetch when component mounts
  useEffect(() => {
    // Trigger initial fetch for default values
    if (selectedVehicle && selectedCategory) {
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
  }, []); // Empty dependency array - only run once on mount

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

  // Show loading if admin is fetching affiliate ID
  if (user?.role === 'admin' && businessSlug && !affiliateId) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading affiliate data...</div>
      </div>
    );
  }

  // Show error if no affiliate ID is available
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
      setSelectedCategory(vehicle.categories[0]?.id || 'interior');
      setSelectedService(''); // Reset service selection
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedService(''); // Reset service selection
  };

  const handleAddService = async (serviceTitle: string) => {
    try {
      const result = await createService(selectedVehicle, selectedCategory, serviceTitle);
      if (result) {
        // Close modal and refresh services
        setIsAddServiceModalOpen(false);
        
        // Add a small delay to ensure the database transaction is complete
        setTimeout(async () => {
          // Refresh the entire services list for this vehicle/category combination
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
                  features: tier.features,
                  enabled: tier.enabled,
                  popular: tier.popular
                })) : []
              }));
              
              // Update the UI state
              setAvailableServices(services);
              
              // Select the newly created service (it should be the first one due to ORDER BY created_at DESC)
              if (services.length > 0) {
                const newService = services[0];
                if (newService) {
                  setCurrentServiceData(newService);
                  setSelectedService(newService.id);
                }
              }
            }
        }, 500); // 500ms delay to ensure database transaction is complete
      }
    } catch (err) {
      // Error handled silently
    }
  };

  const handleTierUpdate = (tierId: string, updates: Partial<ServiceTier>) => {
    // Implementation for updating tier data
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
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                title="Add Service"
                onClick={() => setIsAddServiceModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                title="Delete Service"
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

      {/* Service Tier Cards */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Loading services...</div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">Error: {error}</div>
        </div>
      )}
      
      {currentServiceData && !loading && !error && (
        <ServiceTierCards
          service={currentServiceData}
          onToggleTier={toggleTierEnabled}
          onUpdateTier={handleTierUpdate}
        />
      )}

      {/* Empty State */}
      {availableServices.length === 0 && !loading && !error && selectedCategoryData && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No services configured</h3>
          <p className="text-gray-400 mb-4">Add services to this category to get started</p>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => setIsAddServiceModalOpen(true)}
          >
            Add Service
          </button>
        </div>
      )}

             {/* Add Service Modal */}
       <AddServiceModal
         isOpen={isAddServiceModalOpen}
         onClose={() => setIsAddServiceModalOpen(false)}
         onSubmit={handleAddService}
         vehicleName={getVehicleDisplayName(selectedVehicle)}
         categoryName={getCategoryDisplayName(selectedCategory)}
         loading={loading}
       />
    </div>
  );
};

export default ServicesTab;