import React from 'react';

import type { Vehicle } from '../types';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onVehicleChange: (vehicleId: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleChange
}) => {
  return (
    <div className="p-4">
      {vehicles.map((vehicle) => {
        const VehicleIcon = vehicle.icon as React.ComponentType<{ className?: string }>;
        const isSelected = selectedVehicle === vehicle.id;
        
        return (
          <button
            key={vehicle.id}
            onClick={() => { onVehicleChange(vehicle.id); }}
              className={`w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${
              isSelected 
                ? 'bg-green-600 text-white' 
                : 'text-gray-300 hover:bg-stone-700 hover:text-white'
            }`}
          >
            <VehicleIcon className="h-5 w-5" />
            <span>{vehicle.name}</span>
          </button>
        );
      })}
    </div>
  );
};