import React from 'react';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { Vehicle } from '../types';

interface VehicleSelectionProps {
  availableVehicles: Vehicle[];
  selectedVehicle: string;
  loading: boolean;
  onVehicleSelect: (vehicleId: string) => void;
  onBackToHome: () => void;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  availableVehicles,
  selectedVehicle,
  loading,
  onVehicleSelect,
  onBackToHome,
}) => {
  const handleVehicleClick = (vehicle: Vehicle) => {
    if (selectedVehicle === vehicle.id) {
      // Clear selection if clicking the same vehicle
      onVehicleSelect('');
    } else {
      // Select the vehicle
      onVehicleSelect(vehicle.id);
      // Scroll to vehicle details section after a brief delay
      setTimeout(() => {
        const element = document.querySelector('[data-vehicle-details]');
        if (element) {
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.scrollY;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, vehicle: Vehicle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVehicleClick(vehicle);
    }
  };

  return (
    <section id="vehicle-selection" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Vehicle Type
          </h2>
          <p className="text-xl text-stone-300">
            Select your vehicle to see available services and pricing
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading available services...</div>
          </div>
        ) : availableVehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-4">No services available for this business</div>
            <Button
              onClick={onBackToHome}
              variant="primary"
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {availableVehicles.map((vehicle) => {
              const IconComponent = vehicle.icon as React.ComponentType<{ className?: string }>;
              const isSelected = selectedVehicle === vehicle.id;
              
              return (
                <div
                  key={vehicle.id}
                  className={`bg-stone-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-stone-700 w-full sm:w-64 lg:w-56 ${
                    isSelected ? 'ring-2 ring-orange-500 bg-stone-700' : ''
                  }`}
                  onClick={() => handleVehicleClick(vehicle)}
                  onKeyDown={(e) => handleKeyDown(e, vehicle)}
                  role="button"
                  tabIndex={0}
                >
                  <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
                  <p className="text-stone-300 mb-6 text-sm">{vehicle.description}</p>
                  <Button 
                    variant={isSelected ? "primary" : "secondary"}
                    size="md"
                    className={`w-full py-2 px-4 ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-stone-700 hover:bg-orange-500'}`}
                    leftIcon={isSelected ? <CheckCircle size={16} /> : undefined}
                  >
                    {isSelected ? 'Selected' : 'Choose'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default VehicleSelection;
