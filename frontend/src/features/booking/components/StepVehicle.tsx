import React, { useState } from 'react';
import { Bike, Car, Ship, Truck } from 'lucide-react';

import { Button } from '@/shared/ui';

import { useVehicleData } from '../hooks';
import type { VehicleSelection } from '../schemas/booking.schemas';

interface StepVehicleProps {
  onNext: (vehicleData: VehicleSelection) => void;
  onPrevious: () => void;
  initialData?: VehicleSelection;
}

const vehicleIcons = {
  car: Car,
  truck: Truck,
  boat: Ship,
  motorcycle: Bike
};

const StepVehicle: React.FC<StepVehicleProps> = ({ onNext, onPrevious, initialData }) => {
  const { vehicleTypes, getMakes, getModels, vehicleYears } = useVehicleData();
  const [selectedType, setSelectedType] = useState(initialData?.type || '');
  const [selectedMake, setSelectedMake] = useState(initialData?.make || '');
  const [selectedModel, setSelectedModel] = useState(initialData?.model || '');
  const [selectedYear, setSelectedYear] = useState(initialData?.year || '');

  const makes = selectedType ? getMakes(selectedType) : [];
  const models = selectedMake ? getModels(selectedType, selectedMake) : [];

  const handleNext = () => {
    if (selectedType && selectedMake && selectedModel && selectedYear) {
      onNext({
        type: selectedType,
        make: selectedMake,
        model: selectedModel,
        year: selectedYear
      });
    }
  };

  const isComplete = selectedType && selectedMake && selectedModel && selectedYear;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Select Your Vehicle</h2>
      
      {/* Vehicle Type */}
      <div className="mb-6">
        <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-300 mb-3">
          Vehicle Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vehicleTypes.map((type) => {
            const IconComponent = vehicleIcons[type.id as keyof typeof vehicleIcons];
            return (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedType === type.id
                    ? 'border-orange-400 bg-orange-400/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-2 text-white" />
                <span className="text-sm text-white">{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Make */}
      {selectedType && (
        <div className="mb-6">
          <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-300 mb-3">
            Make
          </label>
          <select
            id="vehicle-make"
            value={selectedMake}
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel('');
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vehicle Model */}
      {selectedMake && (
        <div className="mb-6">
          <label htmlFor="vehicle-model" className="block text-sm font-medium text-gray-300 mb-3">
            Model
          </label>
          <select
            id="vehicle-model"
            value={selectedModel}
            onChange={(e) => { setSelectedModel(e.target.value); return; }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vehicle Year */}
      {selectedModel && (
        <div className="mb-6">
          <label htmlFor="vehicle-year" className="block text-sm font-medium text-gray-300 mb-3">
            Year
          </label>
          <select
            id="vehicle-year"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); return; }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Select Year</option>
            {vehicleYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="md"
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          size="md"
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepVehicle;
