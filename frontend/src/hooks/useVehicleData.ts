import { useMemo } from 'react';

import { 
  getMakesForType, 
  getModelsForMake, 
  vehicleData, 
  vehicleTypes} from '../../data/vehicle_data';
import type { VehicleSelection } from '../types/vehicle';

export const useVehicleData = () => {
  // Get all available vehicle types
  const availableVehicleTypes = useMemo(() => vehicleTypes, []);

  // Get makes for a specific vehicle type
  const getMakes = (vehicleType: string) => {
    return getMakesForType(vehicleType);
  };

  // Get models for a specific make and vehicle type
  const getModels = (vehicleType: string, make: string) => {
    return getModelsForMake(vehicleType, make);
  };

  // Get all makes across all vehicle types
  const getAllMakes = useMemo(() => {
    const allMakes = new Set<string>();
    
    // Add car makes
    (vehicleData.car as Array<{ brand: string }>).forEach(car => allMakes.add(car.brand));
    
    // Add boat makes
    Object.keys(vehicleData.boat as Record<string, unknown>).forEach(boatMake => allMakes.add(boatMake));
    
    // Add RV makes
    Object.keys(vehicleData.rv as Record<string, unknown>).forEach(rvMake => allMakes.add(rvMake));
    
    // Add motorcycle makes
    Object.keys(vehicleData.motorcycle as Record<string, unknown>).forEach(motorcycleMake => allMakes.add(motorcycleMake));
    
    return Array.from(allMakes).sort();
  }, []);

  // Search makes by name (case-insensitive)
  const searchMakes = (query: string, vehicleType?: string) => {
    const makes = vehicleType ? getMakes(vehicleType) : getAllMakes;
    const lowerQuery = query.toLowerCase();
    
    return makes.filter(make => 
      make.toLowerCase().includes(lowerQuery)
    );
  };

  // Search models by name (case-insensitive)
  const searchModels = (query: string, vehicleType: string, make: string) => {
    const models = getModels(vehicleType, make);
    const lowerQuery = query.toLowerCase();
    
    return models.filter(model => 
      model.toLowerCase().includes(lowerQuery)
    );
  };

  // Get popular makes (you can customize this logic)
  const getPopularMakes = useMemo(() => {
    // For now, return first 5 makes from cars, boats, RVs, and motorcycles
    const popularCarMakes = (vehicleData.car as Array<{ brand: string }>).slice(0, 5).map(car => car.brand);
    const popularBoatMakes = Object.keys(vehicleData.boat as Record<string, unknown>).slice(0, 5);
    const popularRvMakes = Object.keys(vehicleData.rv as Record<string, unknown>).slice(0, 5);
    const popularMotorcycleMakes = Object.keys(vehicleData.motorcycle as Record<string, unknown>).slice(0, 5);
    
    return [...popularCarMakes, ...popularBoatMakes, ...popularRvMakes, ...popularMotorcycleMakes];
  }, []);

  // Validate vehicle selection
  const validateVehicleSelection = (selection: VehicleSelection): boolean => {
    const { type, make, model } = selection;
    
    if (!type || !make || !model) return false;
    
    const makes = getMakes(type);
    if (!makes.includes(make)) return false;
    
    const models = getModels(type, make);
    return models.includes(model);
  };

  return {
    // Data
    vehicleData,
    vehicleTypes: availableVehicleTypes,
    
    // Functions
    getMakes,
    getModels,
    getAllMakes,
    searchMakes,
    searchModels,
    getPopularMakes,
    validateVehicleSelection,
    
    // Convenience getters
    carMakes: useMemo(() => getMakes('car'), []),
    boatMakes: useMemo(() => getMakes('boat'), []),
    rvMakes: useMemo(() => getMakes('rv'), []),
    motorcycleMakes: useMemo(() => getMakes('motorcycle'), []),
  };
};
