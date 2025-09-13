import React, { useEffect, useState } from 'react';

import type { Vehicle } from '../types';

interface VehicleDetailsProps {
  selectedVehicle: string;
  vehicleMakes: string[];
  vehicleModels: { [make: string]: string[] };
  vehicleYears: string[];
  vehicleColors: string[];
  onVehicleDetailsChange: (details: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  }) => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  selectedVehicle,
  vehicleMakes,
  vehicleModels,
  vehicleYears,
  vehicleColors,
  onVehicleDetailsChange,
}) => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedLength, setSelectedLength] = useState<string>('');

  // Check if selected vehicle type should show detailed dropdowns
  const shouldShowVehicleDetails = selectedVehicle && ['car', 'truck', 'boat', 'rv'].includes(selectedVehicle);


  // Reset vehicle details when vehicle type changes
  useEffect(() => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedColor('');
    setSelectedLength('');
  }, [selectedVehicle]);

  // Notify parent of changes
  useEffect(() => {
    onVehicleDetailsChange({
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      color: selectedColor,
      length: selectedLength,
    });
  }, [selectedMake, selectedModel, selectedYear, selectedColor, selectedLength, onVehicleDetailsChange]);

  if (!selectedVehicle || !shouldShowVehicleDetails) {
    return null;
  }

  return (
    <section data-vehicle-details className="py-16 bg-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-700 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Vehicle Details</h2>
          
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Make Dropdown */}
              <div>
                <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                <select
                  id="vehicle-make"
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel(''); // Reset model when make changes
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
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full px-3 py-2 bg-stone-600 border border-stone-500 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Model</option>
                  {selectedMake && vehicleModels[selectedMake]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div>
                <label htmlFor="vehicle-year" className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <select
                  id="vehicle-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
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
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
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

          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetails;
