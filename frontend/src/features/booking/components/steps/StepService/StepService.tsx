import React from 'react';
import ServiceCarousel from './ServiceCarousel';
import { useBookingService, useBookingVehicle } from '@/features/booking/state';
import { useServiceTiers } from '@/features/booking/hooks';

const StepService: React.FC = () => {
  // Get vehicle data from narrow selector
  const { vehicle } = useBookingVehicle();
  
  // Get service data from narrow selector
  const { serviceTier, setServiceTier } = useBookingService();

  // Use the data hook for service tiers
  const { serviceTiers, isLoading, error } = useServiceTiers(vehicle || '');

  const handleServiceSelect = (serviceId: string) => {
    setServiceTier(serviceId); // Update Zustand store
  };

  // Guard against missing vehicle selection
  if (!vehicle) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-white text-lg">Please select a vehicle first.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-white">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading services: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
        <ServiceCarousel
          services={serviceTiers}
          selectedService={serviceTier}
          onServiceSelect={handleServiceSelect}
        />
    </div>
  );
};

export default StepService;