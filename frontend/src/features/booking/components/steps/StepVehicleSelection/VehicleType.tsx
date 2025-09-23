import React, { useState, useEffect, useRef } from 'react';
import { getMakesForType, getModelsForMake, getVehicleYears } from '@/data/vehicle_data';

interface VehicleSelectionProps {
  selectedVehicle: string;
  vehicleDetails: { make: string; model: string; year: string; color: string; length: string };
  onVehicleDetailsSelect?: (details: { make: string; model: string; year: string; color: string; length: string }) => void;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({ selectedVehicle, vehicleDetails, onVehicleDetailsSelect }) => {
  const [make, setMake] = useState(vehicleDetails.make || '');
  const [model, setModel] = useState(vehicleDetails.model || '');
  const [year, setYear] = useState(vehicleDetails.year || '');
  const [color, setColor] = useState(vehicleDetails.color || '');
  const [length, setLength] = useState(vehicleDetails.length || '');
  const lastDetailsRef = useRef<string>('');

  // Vehicle ID is now already the correct vehicle type name (no mapping needed)
  const vehicleTypeName = selectedVehicle;

  // Get available makes based on selected vehicle type
  const availableMakes = getMakesForType(vehicleTypeName);
  
  // Get available models based on selected make and vehicle type
  const availableModels = make ? getModelsForMake(vehicleTypeName, make) : [];
  
  // Get available years
  const availableYears = getVehicleYears();

  // Update local state when vehicleDetails prop changes
  useEffect(() => {
    setMake(vehicleDetails.make || '');
    setModel(vehicleDetails.model || '');
    setYear(vehicleDetails.year || '');
    setColor(vehicleDetails.color || '');
    setLength(vehicleDetails.length || '');
  }, [vehicleDetails]);



  // Helper function to update vehicle details
  const updateVehicleDetails = (newMake?: string, newModel?: string, newYear?: string, newColor?: string, newLength?: string) => {
    const currentMake = newMake !== undefined ? newMake : make;
    const currentModel = newModel !== undefined ? newModel : model;
    const currentYear = newYear !== undefined ? newYear : year;
    const currentColor = newColor !== undefined ? newColor : color;
    const currentLength = newLength !== undefined ? newLength : length;
    
    if (currentMake && currentModel && currentYear) {
      const currentDetails = JSON.stringify({ 
        make: currentMake, 
        model: currentModel, 
        year: currentYear, 
        color: currentColor || '', 
        length: currentLength || '' 
      });
      
      if (currentDetails !== lastDetailsRef.current) {
        lastDetailsRef.current = currentDetails;
        onVehicleDetailsSelect?.({
          make: currentMake,
          model: currentModel,
          year: currentYear,
          color: currentColor || '',
          length: currentLength || ''
        });
      }
    }
  };

  return (
    <div className="mb-8 absolute top-[45%] left-1/2 transform -translate-x-1/2 w-full max-w-xl">
      <div className="grid grid-cols-2 gap-4 px-4">
        {/* Make Dropdown */}
        <div className="space-y-2">
          <label className="block text-white font-medium text-sm">Make</label>
          <select 
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              updateVehicleDetails(e.target.value);
            }}
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
            onChange={(e) => {
              setModel(e.target.value);
              updateVehicleDetails(undefined, e.target.value);
            }}
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
            onChange={(e) => {
              setYear(e.target.value);
              updateVehicleDetails(undefined, undefined, e.target.value);
            }}
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
              onChange={(e) => {
                setLength(e.target.value);
                updateVehicleDetails(undefined, undefined, undefined, undefined, e.target.value);
              }}
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
              onChange={(e) => {
                setColor(e.target.value);
                updateVehicleDetails(undefined, undefined, undefined, e.target.value);
              }}
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
