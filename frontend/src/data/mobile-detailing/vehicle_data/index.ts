// Import vehicle data
import airplaneData from './AirplaneMakeModel.json';
import boatData from './BoatMakeModel.json';
import carData from './CarMakeModel.json';
import motorcycleData from './MotorcycleMakeModel.json';
import rvData from './RvMakeModel.json';

// Export individual data sets
export { airplaneData, boatData, carData, motorcycleData, rvData };

// Export combined data
export const vehicleData = {
  airplane: airplaneData,
  boat: boatData,
  car: carData,
  rv: rvData,
  motorcycle: motorcycleData,
};

// Export vehicle types
export const vehicleTypes = [
  { id: 'car', name: 'Car', data: carData },
  { id: 'truck', name: 'Truck', data: [] },
  { id: 'boat', name: 'Boat', data: boatData },
  { id: 'rv', name: 'RV', data: rvData },
  { id: 'airplane', name: 'Airplane', data: airplaneData },
  { id: 'motorcycle', name: 'Motorcycle', data: motorcycleData },
  { id: 'off-road', name: 'Off-Road', data: [] },
  { id: 'other', name: 'Other', data: [] },
  // Future vehicle types can be added here
];

// Helper function to get all makes for a vehicle type
export const getMakesForType = (vehicleType: string) => {
  let makes: string[] = [];
  
  switch (vehicleType) {
    case 'car': {
      makes = carData.map(item => item.brand);
      break;
    }
    case 'truck':
    case 'suv': {
      makes = carData.map(item => item.brand);
      break;
    }
    case 'off-road':
    case 'other': {
      makes = []; // No predefined makes for these types
      break;
    }
    case 'boat': {
      makes = Object.keys(boatData);
      break;
    }
    case 'rv': {
      makes = Object.keys(rvData);
      break;
    }
    case 'motorcycle': {
      makes = Object.keys(motorcycleData);
      break;
    }
    case 'airplane': {
      makes = Object.keys(airplaneData);
      break;
    }
    default: {
      makes = [];
    }
  }
  
  // Always add 'Other' at the end if it's not already there
  if (!makes.includes('Other')) {
    makes.push('Other');
  }
  
  return makes;
};

// Helper function to get models for a specific make and vehicle type
export const getModelsForMake = (vehicleType: string, make: string) => {
  let models: string[] = [];
  
  switch (vehicleType) {
    case 'car': {
      const carItem = carData.find(item => item.brand === make);
      models = carItem ? carItem.models : [];
      break;
    }
    case 'truck':
    case 'suv': {
      const carItem = carData.find(item => item.brand === make);
      models = carItem ? carItem.models : [];
      break;
    }
    case 'off-road':
    case 'other': {
      models = []; // No predefined models for these types
      break;
    }
    case 'boat': {
      if (make in boatData) {
        models = boatData[make as keyof typeof boatData];
      } else {
        models = [];
      }
      break;
    }
    case 'rv': {
      if (make in rvData) {
        models = rvData[make as keyof typeof rvData];
      } else {
        models = [];
      }
      break;
    }
    case 'motorcycle': {
      if (make in motorcycleData) {
        models = motorcycleData[make as keyof typeof motorcycleData];
      } else {
        models = [];
      }
      break;
    }
    case 'airplane': {
      if (make in airplaneData) {
        models = airplaneData[make as keyof typeof airplaneData];
      } else {
        models = [];
      }
      break;
    }
    default: {
      models = [];
    }
  }
  
  // Always add 'Other' at the end if it's not already there
  if (!models.includes('Other')) {
    models.push('Other');
  }
  
  return models;
};

// Export years dropdown utilities
export { getFormattedYears, getVehicleYears, yearsConfig } from './years-dropdown';
