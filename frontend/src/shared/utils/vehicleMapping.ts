// Vehicle type mapping configuration
// Maps frontend vehicle IDs to backend API endpoints and database IDs

export interface VehicleMapping {
  frontendId: string;
  backendEndpoint: string;
  databaseId: number;
  displayName: string;
  description: string;
}

// Vehicle type mappings
export const VEHICLE_MAPPINGS: Record<string, VehicleMapping> = {
  car: {
    frontendId: 'car',
    backendEndpoint: 'car',
    databaseId: 1,
    displayName: 'Car',
    description: 'Sedan/Coupe/Compact'
  },
  truck: {
    frontendId: 'truck',
    backendEndpoint: 'truck',
    databaseId: 2,
    displayName: 'Truck',
    description: 'Light duty, work trucks'
  },
  suv: {
    frontendId: 'suv',
    backendEndpoint: 'suv', // Uses same endpoint as car
    databaseId: 3, // Uses same database ID as car
    displayName: 'SUV',
    description: 'Sport Utility Vehicle'
  },
  rv: {
    frontendId: 'rv',
    backendEndpoint: 'rv',
    databaseId: 4,
    displayName: 'RV',
    description: 'Travel trailers & coaches'
  },
  boat: {
    frontendId: 'boat',
    backendEndpoint: 'boat',
    databaseId: 5,
    displayName: 'Boat',
    description: 'Runabout, bass, wake'
  },
  motorcycle: {
    frontendId: 'motorcycle',
    backendEndpoint: 'motorcycle',
    databaseId: 6,
    displayName: 'Motorcycle',
    description: 'Street & sport bikes'
  }
};

// Helper functions
export const getVehicleMapping = (vehicleId: string): VehicleMapping | undefined => {
  return VEHICLE_MAPPINGS[vehicleId];
};

export const getBackendEndpoint = (vehicleId: string): string => {
  return VEHICLE_MAPPINGS[vehicleId]?.backendEndpoint || 'auto';
};

export const getDatabaseId = (vehicleId: string): number => {
  return VEHICLE_MAPPINGS[vehicleId]?.databaseId || 1;
};

export const getDisplayName = (vehicleId: string): string => {
  return VEHICLE_MAPPINGS[vehicleId]?.displayName || vehicleId;
};

// Get all vehicle IDs that map to the same database ID
export const getVehiclesByDatabaseId = (databaseId: number): string[] => {
  return Object.entries(VEHICLE_MAPPINGS)
    .filter(([_, mapping]) => mapping.databaseId === databaseId)
    .map(([vehicleId, _]) => vehicleId);
};

// Check if two vehicle types are equivalent (same database ID)
export const areVehicleTypesEquivalent = (vehicleId1: string, vehicleId2: string): boolean => {
  const mapping1 = getVehicleMapping(vehicleId1);
  const mapping2 = getVehicleMapping(vehicleId2);
  return mapping1?.databaseId === mapping2?.databaseId;
};

// Get the primary vehicle type for a given database ID
export const getPrimaryVehicleType = (databaseId: number): string => {
  const vehicles = getVehiclesByDatabaseId(databaseId);
  // Priority order: car > truck > suv > rv > boat > motorcycle
  const priorityOrder = ['car', 'truck', 'suv', 'rv', 'boat', 'motorcycle'];
  return vehicles.find(vehicleId => priorityOrder.includes(vehicleId)) || vehicles[0] || 'car';
};
