import React, { useState, useEffect } from 'react';
import { getMakesForType, getModelsForMake, getVehicleYears } from '@/data/vehicle_data';

interface VehicleSelectionProps {
  selectedVehicle: string;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({ selectedVehicle }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [length, setLength] = useState('');

  // Vehicle ID is now already the correct vehicle type name (no mapping needed)
  const vehicleTypeName = selectedVehicle;

  // Get available makes based on selected vehicle type
  const availableMakes = getMakesForType(vehicleTypeName);
  
  // Get available models based on selected make and vehicle type
  const availableModels = make ? getModelsForMake(vehicleTypeName, make) : [];
  
  // Get available years
  const availableYears = getVehicleYears();

  // Reset dependent fields when vehicle type or make changes
  useEffect(() => {
    setModel('');
  }, [selectedVehicle, make]);

  useEffect(() => {
    setMake('');
    setModel('');
    setYear('');
    setColor('');
    setLength('');
  }, [selectedVehicle]);

  return (
    <div className="mb-8 absolute top-[45%] left-1/2 transform -translate-x-1/2 w-full max-w-xl">
      <div className="grid grid-cols-2 gap-4 px-4">
        {/* Make Dropdown */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-sm">Make</label>
          <select 
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            disabled={!selectedVehicle}
          >
            <option value="">Select Make</option>
            {availableMakes.map((makeOption) => (
              <option key={makeOption} value={makeOption}>
                {makeOption}
              </option>
            ))}
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-sm">Model</label>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            disabled={!make}
          >
            <option value="">Select Model</option>
            {availableModels.map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-sm">Year</label>
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Select Year</option>
            {availableYears.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        {/* Color Dropdown or Length Input */}
        {selectedVehicle === 'boat' || selectedVehicle === 'rv' ? (
          /* Length Input for Boat/RV */
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">Length (ft)</label>
            <input 
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Enter length in feet"
              className="w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              min="1"
              max="999"
            />
          </div>
        ) : (
          /* Color Dropdown for other vehicles */
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">Color</label>
            <select 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full py-3 px-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Select Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="silver">Silver</option>
              <option value="gray">Gray</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSelection;
