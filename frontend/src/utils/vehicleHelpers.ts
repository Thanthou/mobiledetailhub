import { getMakesForType, getModelsForMake,vehicleData } from '../../data/vehicle_data';
import type { VehicleSelection } from '../types/vehicle';

/**
 * Format vehicle display name
 */
export const formatVehicleName = (type: string, make: string, model: string): string => {
  return `${make} ${model} (${type.charAt(0).toUpperCase() + type.slice(1)})`;
};

/**
 * Get vehicle type display name
 */
export const getVehicleTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    car: 'Car',
    truck: 'Truck',
    boat: 'Boat',
    rv: 'RV',
    motorcycle: 'Motorcycle',
    atv: 'ATV',
    utv: 'UTV',
  };
  
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Check if a vehicle type is supported
 */
export const isVehicleTypeSupported = (type: string): boolean => {
  return Object.keys(vehicleData).includes(type);
};

/**
 * Get all available makes for a vehicle type
 */
export const getAvailableMakes = (type: string): string[] => {
  if (!isVehicleTypeSupported(type)) return [];
  return getMakesForType(type);
};

/**
 * Get all available models for a make and vehicle type
 */
export const getAvailableModels = (type: string, make: string): string[] => {
  if (!isVehicleTypeSupported(type)) return [];
  return getModelsForMake(type, make);
};

/**
 * Search makes by query string
 */
export const searchMakes = (query: string, type?: string): string[] => {
  const makes = type ? getAvailableMakes(type) : Object.values(vehicleData).flatMap(data => {
    if (Array.isArray(data)) {
      return data.map(item => item.brand);
    } else {
      return Object.keys(data);
    }
  });
  
  const lowerQuery = query.toLowerCase();
  return makes.filter(make => make.toLowerCase().includes(lowerQuery));
};

/**
 * Search models by query string
 */
export const searchModels = (query: string, type: string, make: string): string[] => {
  const models = getAvailableModels(type, make);
  const lowerQuery = query.toLowerCase();
  return models.filter(model => model.toLowerCase().includes(lowerQuery));
};

/**
 * Validate a complete vehicle selection
 */
export const validateVehicleSelection = (selection: VehicleSelection): boolean => {
  const { type, make, model } = selection;
  
  if (!type || !make || !model) return false;
  if (!isVehicleTypeSupported(type)) return false;
  
  const makes = getAvailableMakes(type);
  if (!makes.includes(make)) return false;
  
  const models = getAvailableModels(type, make);
  return models.includes(model);
};

/**
 * Get vehicle statistics
 */
export const getVehicleStats = () => {
  const stats = {
    totalTypes: Object.keys(vehicleData).length,
    totalMakes: 0,
    totalModels: 0,
    byType: {} as Record<string, { makes: number; models: number }>
  };
  
  Object.entries(vehicleData).forEach(([type, data]) => {
    if (Array.isArray(data)) {
      // Car data structure
      const makes = data.length;
      const models = data.reduce((sum, item) => sum + item.models.length, 0);
      stats.byType[type] = { makes, models };
      stats.totalMakes += makes;
      stats.totalModels += models;
    } else {
      // Boat/RV data structure (both use the same format)
      const makes = Object.keys(data).length;
      const models = Object.values(data).reduce((sum, modelArray) => sum + modelArray.length, 0);
      stats.byType[type] = { makes, models };
      stats.totalMakes += makes;
      stats.totalModels += models;
    }
  });
  
  return stats;
};

/**
 * Get popular makes (first 5 of each type)
 */
export const getPopularMakes = (): string[] => {
  const popular: string[] = [];
  
  Object.entries(vehicleData).forEach(([, data]) => {
    if (Array.isArray(data)) {
      // Car data structure
      popular.push(...data.slice(0, 5).map(item => item.brand));
    } else {
      // Boat/RV data structure (both use the same format)
      popular.push(...Object.keys(data).slice(0, 5));
    }
  });
  
  return popular;
};
