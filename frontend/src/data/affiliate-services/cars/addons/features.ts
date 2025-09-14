/**
 * Predefined addon service options for cars
 * These are organized by specific addon categories: interior-trim, windows, wheels
 */

import interiorTrimServices from './trim.json';
import windowsServices from './windows.json';
import wheelsServices from './wheels.json';

export interface AddonServiceOption {
  id: string;
  name: string;
  description: string;
  explanation: string;
  duration: number;
  category: 'interior-trim' | 'windows' | 'wheels';
  features: string[];
}

// Convert JSON data to TypeScript format
const convertJsonToServiceOptions = (
  jsonData: Record<string, any>,
  category: 'interior-trim' | 'windows' | 'wheels'
): AddonServiceOption[] => {
  return Object.entries(jsonData).map(([key, service]) => ({
    id: key,
    name: service.name,
    description: service.description,
    explanation: service.explanation,
    duration: service.duration,
    category,
    features: service.features || []
  }));
};

// Individual addon service options by category
export const CAR_INTERIOR_TRIM_SERVICE_OPTIONS: AddonServiceOption[] = 
  convertJsonToServiceOptions(interiorTrimServices, 'interior-trim');

export const CAR_WINDOWS_SERVICE_OPTIONS: AddonServiceOption[] = 
  convertJsonToServiceOptions(windowsServices, 'windows');

export const CAR_WHEELS_SERVICE_OPTIONS: AddonServiceOption[] = 
  convertJsonToServiceOptions(wheelsServices, 'wheels');

// All addon services as a single flattened list
export const CAR_ADDON_SERVICE_OPTIONS: AddonServiceOption[] = [
  ...CAR_INTERIOR_TRIM_SERVICE_OPTIONS,
  ...CAR_WINDOWS_SERVICE_OPTIONS,
  ...CAR_WHEELS_SERVICE_OPTIONS
];

// Helper function to get addon service by ID
export const getAddonServiceById = (id: string) => {
  return CAR_ADDON_SERVICE_OPTIONS.find(s => s.id === id);
};

// Helper function to get all addon service IDs (for compatibility with existing code)
export const getAddonServiceIds = (): string[] => {
  return CAR_ADDON_SERVICE_OPTIONS.map(s => s.id);
};
