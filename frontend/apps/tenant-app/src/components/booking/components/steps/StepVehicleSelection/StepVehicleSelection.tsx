import React from 'react';

import { useBookingVehicle } from '@tenant-app/components/booking/state';

import Tabs from './Tabs';
import VehicleSelection from './VehicleType';

interface StepVehicleSelectionProps {
  onVehicleSelected?: (vehicle: string) => void;
  onVehicleDetailsSelected?: (details: { make: string; model: string; year: string; color: string; length: string }) => void;
}

const StepVehicleSelection: React.FC<StepVehicleSelectionProps> = ({ onVehicleSelected, onVehicleDetailsSelected }) => {
  // Get vehicle data from narrow selector
  const { vehicle, vehicleDetails, setVehicle, setVehicleDetails } = useBookingVehicle();
  const selectedVehicle = vehicle;

  const handleVehicleSelect = (vehicleId: string) => {
    setVehicle(vehicleId);
    onVehicleSelected?.(vehicleId);
  };

  const handleVehicleDetailsSelect = (details: { make: string; model: string; year: string; color: string; length: string }) => {
    setVehicleDetails(details);
    onVehicleDetailsSelected?.(details);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs 
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
      />
      <VehicleSelection
        selectedVehicle={selectedVehicle}
        vehicleDetails={vehicleDetails}
        onVehicleDetailsSelect={handleVehicleDetailsSelect}
      />
    </div>
  );
};

export default StepVehicleSelection;