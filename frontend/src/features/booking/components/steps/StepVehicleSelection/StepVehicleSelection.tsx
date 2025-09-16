import React, { useState } from 'react';
import Header from './Header';
import Tabs from './Tabs';
import VehicleSelection from './VehicleType';

interface StepVehicleSelectionProps {
  onVehicleSelected?: (vehicle: string) => void;
}

const StepVehicleSelection: React.FC<StepVehicleSelectionProps> = ({ onVehicleSelected }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    onVehicleSelected?.(vehicleId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Header />
      <Tabs 
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
      />
      <VehicleSelection selectedVehicle={selectedVehicle} />
    </div>
  );
};

export default StepVehicleSelection;