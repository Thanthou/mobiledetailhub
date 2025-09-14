import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';

import type { Vehicle } from '../../../types';

interface StepVehicleSelectionProps {
  availableVehicles: Vehicle[];
  selectedVehicle: string;
  loading: boolean;
  vehicleMakes: string[];
  vehicleModels: { [make: string]: string[] };
  vehicleYears: string[];
  vehicleColors: string[];
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  };
  averageRating: number;
  totalReviews: number;
  onVehicleSelect: (vehicleId: string) => void;
  onVehicleDetailsChange: (details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => void;
  onNext: () => void;
  onBackToHome: () => void;
}

const StepVehicleSelection: React.FC<StepVehicleSelectionProps> = ({
  availableVehicles,
  selectedVehicle,
  loading,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  vehicleColors,
  vehicleDetails,
  averageRating,
  totalReviews,
  onVehicleSelect,
  onVehicleDetailsChange,
  onNext,
  onBackToHome,
}) => {

  // Check if vehicle details are complete - Always allow continue for testing
  const isVehicleDetailsComplete = () => {
    return true; // Always allow continue button to work
  };

  // Handle vehicle details changes
  const handleVehicleDetailsUpdate = (field: string, value: string) => {
    const updatedDetails = {
      ...vehicleDetails,
      [field]: value,
    };
    onVehicleDetailsChange(updatedDetails);
  };
  const handleVehicleClick = (vehicle: Vehicle) => {
    if (selectedVehicle === vehicle.id) {
      onVehicleSelect('');
    } else {
      onVehicleSelect(vehicle.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, vehicle: Vehicle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVehicleClick(vehicle);
    }
  };

  return (
    <StepContainer>
      {/* Main Content Area - Green Container */}
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Tab-style Vehicle Selection */}
          <div className="mb-6">
            {loading ? (
              <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-white text-lg">Loading vehicles...</div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {availableVehicles.map((vehicle) => {
                  const isSelected = selectedVehicle === vehicle.id;
                  const IconComponent = vehicle.icon;
                  
                  return (
                    <button
                      key={vehicle.id}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isSelected 
                          ? 'bg-orange-500 text-white ring-2 ring-orange-300' 
                          : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80'
                      }`}
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{vehicle.name}</span>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vehicle Details Form */}
          <div className="flex justify-center">
            <div className="bg-stone-700/60 backdrop-blur-sm rounded-xl p-6 w-1/2">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Vehicle Details</h3>
              {!selectedVehicle ? (
                <div className="text-center py-8">
                  <p className="text-stone-300 text-base">
                    Please select a vehicle type to see details
                  </p>
                </div>
              ) : !['car', 'truck', 'boat', 'rv'].includes(selectedVehicle) ? (
                <div className="text-center py-8">
                  <p className="text-stone-300 text-base">
                    No additional details required for this vehicle type
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Make Dropdown */}
                  <div>
                    <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                    <select
                      id="vehicle-make"
                      value={vehicleDetails.make}
                      onChange={(e) => {
                        const updatedDetails = {
                          ...vehicleDetails,
                          make: e.target.value,
                          model: '', // Reset model when make changes
                        };
                        onVehicleDetailsChange(updatedDetails);
                      }}
                      className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Make</option>
                      {vehicleMakes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model Dropdown */}
                  <div>
                    <label htmlFor="vehicle-model" className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <select
                      id="vehicle-model"
                      value={vehicleDetails.model}
                      onChange={(e) => handleVehicleDetailsUpdate('model', e.target.value)}
                      disabled={!vehicleDetails.make}
                      className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Model</option>
                      {vehicleDetails.make && vehicleModels[vehicleDetails.make]?.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Dropdown */}
                  <div>
                    <label htmlFor="vehicle-year" className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <select
                      id="vehicle-year"
                      value={vehicleDetails.year}
                      onChange={(e) => handleVehicleDetailsUpdate('year', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Year</option>
                      {vehicleYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Color or Length Dropdown */}
                  {['boat', 'rv'].includes(selectedVehicle) ? (
                    <div>
                      <label htmlFor="vehicle-length" className="block text-sm font-medium text-gray-300 mb-2">Length (ft)</label>
                      <select
                        id="vehicle-length"
                        value={vehicleDetails.length}
                        onChange={(e) => handleVehicleDetailsUpdate('length', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Length</option>
                        {Array.from({ length: 50 }, (_, i) => (i + 10).toString()).map((length) => (
                          <option key={length} value={length}>{length} ft</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="vehicle-color" className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                      <select
                        id="vehicle-color"
                        value={vehicleDetails.color}
                        onChange={(e) => handleVehicleDetailsUpdate('color', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Color</option>
                        {vehicleColors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orange Container - Footer inside Green */}
        <div className="-mt-52 pb-4">
        <StepBottomSection
          onNext={() => {
            if (onNext) {
              onNext();
            }
          }}
          showNext={true}
          nextText="Continue"
          averageRating={averageRating}
          totalReviews={totalReviews}
          currentStep={1}
            totalSteps={5}
        />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepVehicleSelection;
