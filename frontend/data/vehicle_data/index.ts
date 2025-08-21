// Import vehicle data
import boatData from './BoatMakeModel.json';
import carData from './CarMakeModel.json';
import rvData from './RvMakeModel.json';
import motorcycleData from './MotorcycleMakeModel.json';

// Export individual data sets
export { boatData, carData, rvData, motorcycleData };

// Export combined data
export const vehicleData = {
  boat: boatData,
  car: carData,
  rv: rvData,
  motorcycle: motorcycleData,
};

// Export vehicle types
export const vehicleTypes = [
  { id: 'car', name: 'Car', data: carData },
  { id: 'boat', name: 'Boat', data: boatData },
  { id: 'rv', name: 'RV', data: rvData },
  { id: 'motorcycle', name: 'Motorcycle', data: motorcycleData },
  // Future vehicle types can be added here
  // { id: 'truck', name: 'Truck', data: truckData },
];

// Helper function to get all makes for a vehicle type
export const getMakesForType = (vehicleType: string) => {
  switch (vehicleType) {
    case 'car':
      return carData.map(item => item.brand);
    case 'boat':
      return Object.keys(boatData);
    case 'rv':
      return Object.keys(rvData);
    case 'motorcycle':
      return Object.keys(motorcycleData);
    default:
      return [];
  }
};

// Helper function to get models for a specific make and vehicle type
export const getModelsForMake = (vehicleType: string, make: string) => {
  switch (vehicleType) {
    case 'car':
      const carItem = carData.find(item => item.brand === make);
      return carItem ? carItem.models : [];
    case 'boat':
      return boatData[make as keyof typeof boatData] || [];
    case 'rv':
      return rvData[make as keyof typeof rvData] || [];
    case 'motorcycle':
      return motorcycleData[make as keyof typeof motorcycleData] || [];
    default:
      return [];
  }
};
