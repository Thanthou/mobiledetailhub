import React from 'react';
import { Car, CarFront, Truck, Bike, Ship, Sailboat, Home, MoreHorizontal } from 'lucide-react';

interface TabsProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedVehicle, onVehicleSelect }) => {
  // Static vehicle types - no backend dependency
  const vehicleTypes = [
    { id: 'car', name: 'Car', icon: CarFront },
    { id: 'truck', name: 'Truck', icon: Truck },
    { id: 'suv', name: 'SUV', icon: Car }, // SUV keeps Car icon
    { id: 'boat', name: 'Boat', icon: Ship },
    { id: 'rv', name: 'RV', icon: 'custom-rv' }, // Custom RV icon
    { id: 'other', name: 'Other', icon: MoreHorizontal },
  ];

  return (
    <div className="mb-8 absolute top-[30%] left-1/2 transform -translate-x-1/2 w-full">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {vehicleTypes.map((vehicle) => {
          return (
            <button
              key={vehicle.id}
              onClick={() => onVehicleSelect(vehicle.id)}
              className={`p-2 rounded-lg border-2 transition-all w-24 h-24 ${
                selectedVehicle === vehicle.id
                  ? 'border-orange-500 bg-orange-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {vehicle.icon === 'custom-rv' ? (
                <img 
                  src="/icons/rv.png" 
                  alt="RV" 
                  className="w-8 h-8 mb-2 mx-auto object-contain filter brightness-0 invert" 
                />
              ) : (
                React.createElement(vehicle.icon, { className: "w-8 h-8 text-white mb-2 mx-auto" })
              )}
              <div className="text-white font-medium">{vehicle.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
