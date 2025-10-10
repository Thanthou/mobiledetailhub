import { useCallback, useState } from 'react';

// Basic vehicle types
const vehicleTypes = [
  { id: 'cars', name: 'Cars' },
  { id: 'trucks', name: 'Trucks' },
  { id: 'suvs', name: 'SUVs' },
  { id: 'vans', name: 'Vans' },
  { id: 'motorcycles', name: 'Motorcycles' }
];

// Basic makes
const vehicleMakes = [
  'Honda', 'Toyota', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 
  'Audi', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru'
];

export const useVehicleData = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');

  const getMakes = useCallback(() => {
    // Return all makes for any vehicle type (simplified)
    return vehicleMakes;
  }, []);

  const getModels = useCallback(() => {
    // Return some common models (simplified)
    const commonModels = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe'];
    return commonModels;
  }, []);

  return {
    vehicleTypes,
    getMakes,
    getModels,
    selectedVehicleType,
    setSelectedVehicleType
  };
};

