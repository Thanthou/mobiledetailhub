// Vehicle type mapping configuration for backend
// Maps frontend vehicle IDs to database IDs and backend endpoints

const VEHICLE_MAPPINGS = {
  cars: {
    frontendId: 'cars',
    backendEndpoint: 'car',
    databaseId: 1,
    displayName: 'Cars',
    description: 'Sedan/Coupe/Compact'
  },
  trucks: {
    frontendId: 'trucks',
    backendEndpoint: 'truck',
    databaseId: 2,
    displayName: 'Trucks',
    description: 'Light duty, work trucks'
  },
  suv: {
    frontendId: 'suv',
    backendEndpoint: 'auto',
    databaseId: 3,
    displayName: 'SUV',
    description: 'Sport Utility Vehicle'
  },
  rvs: {
    frontendId: 'rvs',
    backendEndpoint: 'rv',
    databaseId: 4,
    displayName: 'RVs',
    description: 'Travel trailers & coaches'
  },
  boats: {
    frontendId: 'boats',
    backendEndpoint: 'boat',
    databaseId: 5,
    displayName: 'Boats',
    description: 'Runabout, bass, wake'
  },
  motorcycles: {
    frontendId: 'motorcycles',
    backendEndpoint: 'motorcycle',
    databaseId: 6,
    displayName: 'Motorcycles',
    description: 'Street & sport bikes'
  }
};

// Helper functions
const getVehicleMapping = (vehicleId) => {
  return VEHICLE_MAPPINGS[vehicleId];
};

const getDatabaseId = (vehicleId) => {
  return VEHICLE_MAPPINGS[vehicleId]?.databaseId || 1;
};

const getDisplayName = (vehicleId) => {
  return VEHICLE_MAPPINGS[vehicleId]?.displayName || vehicleId;
};

// Get all vehicle IDs that map to the same database ID
const getVehiclesByDatabaseId = (databaseId) => {
  return Object.entries(VEHICLE_MAPPINGS)
    .filter(([_, mapping]) => mapping.databaseId === databaseId)
    .map(([vehicleId, _]) => vehicleId);
};

// Get the primary vehicle type for a given database ID
const getPrimaryVehicleType = (databaseId) => {
  const vehicles = getVehiclesByDatabaseId(databaseId);
  // Priority order: car > truck > suv > rv > boat > motorcycle
  const priorityOrder = ['car', 'truck', 'suv', 'rv', 'boat', 'motorcycle'];
  return vehicles.find(vehicleId => priorityOrder.includes(vehicleId)) || vehicles[0] || 'car';
};

module.exports = {
  VEHICLE_MAPPINGS,
  getVehicleMapping,
  getDatabaseId,
  getDisplayName,
  getVehiclesByDatabaseId,
  getPrimaryVehicleType
};
