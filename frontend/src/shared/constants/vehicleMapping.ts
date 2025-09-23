/**
 * Vehicle mapping constants and utilities
 * Centralized mapping between vehicle types and folder names
 */

export const VEHICLE_FOLDER_MAP: Record<string, string> = {
  'car': 'cars',
  'truck': 'trucks',
  'suv': 'suvs',
  'boat': 'boats',
  'rv': 'rvs'
} as const;

export type VehicleType = keyof typeof VEHICLE_FOLDER_MAP;

/**
 * Convert vehicle type to folder name
 */
export const toFolderName = (vehicleType: string): string | null => {
  return VEHICLE_FOLDER_MAP[vehicleType] || null;
};

/**
 * Check if vehicle type is valid
 */
export const isValidVehicleType = (vehicleType: string): vehicleType is VehicleType => {
  return vehicleType in VEHICLE_FOLDER_MAP;
};

/**
 * Get all available vehicle types
 */
export const getAvailableVehicleTypes = (): VehicleType[] => {
  return Object.keys(VEHICLE_FOLDER_MAP) as VehicleType[];
};

/**
 * Get all available folder names
 */
export const getAvailableFolderNames = (): string[] => {
  return Object.values(VEHICLE_FOLDER_MAP);
};
