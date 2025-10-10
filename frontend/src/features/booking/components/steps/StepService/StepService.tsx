import React from 'react';

import { useServiceTiers } from '@/features/booking/hooks';
import { useBookingService, useBookingVehicle } from '@/features/booking/state';

import ServiceCarousel from './ServiceCarousel';

/**
 * Component that loads and displays service tiers for a confirmed vehicle
 */
const ServiceLoader: React.FC<{ vehicle: string }> = ({ vehicle }) => {
  const { serviceTier, setServiceTier } = useBookingService();
  const { serviceTiers, isLoading, error } = useServiceTiers(vehicle);

  const handleServiceSelect = (serviceId: string) => {
    setServiceTier(serviceId);
  };

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

const StepService: React.FC = () => {
  const { vehicle } = useBookingVehicle();

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

  return <ServiceLoader vehicle={vehicle} />;
};

export default StepService;