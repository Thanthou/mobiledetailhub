// Types for vehicle data structures

export interface CarMakeModel {
  brand: string;
  models: string[];
}

export interface BoatMakeModel {
  [make: string]: string[];
}

export interface RvMakeModel {
  [make: string]: string[];
}

export interface MotorcycleMakeModel {
  [make: string]: string[];
}

export interface VehicleType {
  id: string;
  name: string;
  data: CarMakeModel[] | BoatMakeModel | RvMakeModel | MotorcycleMakeModel;
}

export interface VehicleSelection {
  type: string;
  make: string;
  model: string;
}

// Union type for all vehicle data
export type VehicleData = CarMakeModel[] | BoatMakeModel | RvMakeModel | MotorcycleMakeModel;

// Type guard functions
export const isCarData = (data: VehicleData): data is CarMakeModel[] => {
  return Array.isArray(data) && data.length > 0 && 'brand' in data[0];
};

export const isBoatData = (data: VehicleData): data is BoatMakeModel => {
  return !Array.isArray(data) && typeof data === 'object' && !isRvData(data) && !isMotorcycleData(data);
};

export const isRvData = (data: VehicleData): data is RvMakeModel => {
  // RV data has the same structure as boat data, so we need to distinguish them
  // For now, we'll assume if it's not car data and not boat data, it's RV data
  return !Array.isArray(data) && typeof data === 'object' && !isBoatData(data) && !isMotorcycleData(data);
};

export const isMotorcycleData = (data: VehicleData): data is MotorcycleMakeModel => {
  // Motorcycle data has the same structure as boat/RV data
  return !Array.isArray(data) && typeof data === 'object' && !isBoatData(data) && !isRvData(data);
};
