import React, { useState, useEffect } from 'react';
import Header from './Header';
import ServiceCarousel from './ServiceCarousel';
import { useBookingStore } from '../../../state';
import { getCardDescription } from '../../../utils/displayUtils';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface StepServiceProps {
  onTierSelected?: (tier: string) => void;
}

const StepService: React.FC<StepServiceProps> = ({ onTierSelected }) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
  
  // Get booking data from Zustand store
  const { bookingData, setServiceTier } = useBookingStore();

  // Log the received booking data for confirmation
  console.log('🎯 StepService received bookingData:', bookingData);
  console.log('🚗 Selected vehicle:', bookingData.vehicle);

  // Load services from JSON based on vehicle type
  useEffect(() => {
    if (bookingData.vehicle) {
      loadServicesForVehicle(bookingData.vehicle);
    } else {
      setServiceTiers([]);
      console.log('⚠️ No vehicle selected');
    }
  }, [bookingData.vehicle]);

  // Dynamic service loading function
  const loadServicesForVehicle = async (vehicleType: string) => {
    try {
      // Map vehicle type to folder name
      const vehicleFolderMap: Record<string, string> = {
        'car': 'cars',
        'truck': 'trucks',
        'suv': 'suvs',
        'boat': 'boats',
        'rv': 'rvs'
      };

      const folderName = vehicleFolderMap[vehicleType];
      if (!folderName) {
        console.log(`⚠️ No services available for vehicle type: ${vehicleType}`);
        setServiceTiers([]);
        return;
      }

      // Dynamically import the services data for the specific vehicle type
      const servicesData = await import(`@/data/affiliate-services/${folderName}/service/services.json`);
      const featuresData = await import(`@/data/affiliate-services/${folderName}/service/features.json`);

      const processedServices = Object.entries(servicesData.default).map(([name, service]: [string, any]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        price: service.cost,
        description: getCardDescription(service, service.features, featuresData.default), // Use description from service data
        features: service.features.map((featureId: string) => getFeatureName(featureId, featuresData.default)), // Feature names for checkmark list
        featureIds: service.features, // Keep the original IDs for modal lookup
        popular: service.popular || false
      }));
      
      setServiceTiers(processedServices);
      console.log(`📊 Loaded services for ${vehicleType} (${folderName}):`, processedServices);
    } catch (error) {
      console.error(`❌ Error loading services for ${vehicleType}:`, error);
      setServiceTiers([]);
    }
  };

  // Helper function to get service description

  // Helper function to get feature name from feature ID
  const getFeatureName = (featureId: string, featuresData: any): string => {
    return featuresData[featureId]?.name || featureId;
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setServiceTier(serviceId); // Update Zustand store
    onTierSelected?.(serviceId);
    console.log('🎯 Service selected:', serviceId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Header />
      
      {/* Service Carousel */}
      <ServiceCarousel
        services={serviceTiers}
        selectedService={selectedService}
        onServiceSelect={handleServiceSelect}
      />
    </div>
  );
};

export default StepService;
