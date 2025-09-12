import serviceDefinitions from '../../services/data/serviceDefinitions.json';
import type { ServiceDefinition } from '../types';

// Helper function to find service definition by name
export const findServiceDefinition = (serviceName: string): ServiceDefinition | null => {
  // Convert service name to key format (lowercase, hyphenated)
  const key = serviceName.toLowerCase().replace(/\s+/g, '-');
  let result = (serviceDefinitions as Record<string, unknown>)[key] as ServiceDefinition | null;
  
  // Handle common spelling variations and formatting differences
  if (!result) {
    const variations: { [key: string]: string } = {
      'preperation-detail': 'preparation-detail', // Fix typo: Preperation -> Preparation
      '1-stage-paint-correction': '1-stage-paint-correction',
      '2-stage-paint-correction': '2-stage-paint-correction', 
      '3-stage-paint-correction': '3-stage-paint-correction',
      '1-stage-ceramic-coating': '1-stage-ceramic-coating',
      '2-stage-ceramic-coating': '2-stage-ceramic-coating',
      '3-stage-ceramic-coating': '3-stage-ceramic-coating',
      'paint-enhancement': 'paint-enhancement',
      'fallout-removal': 'fallout-removal',
      'full-exterior-wash': 'full-exterior-wash',
      // Handle 3-5 year ceramic coating variations
      '3-5-year-ceramic-coating': '2-stage-ceramic-coating',
      '3-5-year-ceramic': '2-stage-ceramic-coating',
      '3-5-year-coating': '2-stage-ceramic-coating',
      // Handle variations with different spacing/formatting
      '1 stage paint correction': '1-stage-paint-correction',
      '2 stage paint correction': '2-stage-paint-correction',
      '3 stage paint correction': '3-stage-paint-correction',
      '1 stage ceramic coating': '1-stage-ceramic-coating',
      '2 stage ceramic coating': '2-stage-ceramic-coating',
      '3 stage ceramic coating': '3-stage-ceramic-coating',
      'paint enhancement': 'paint-enhancement',
      'fallout removal': 'fallout-removal',
      'full exterior wash': 'full-exterior-wash',
      'preparation detail': 'preparation-detail',
      'preperation detail': 'preparation-detail',
      // Handle "Stage X" format variations
      'stage-1-paint-correction': '1-stage-paint-correction',
      'stage-2-paint-correction': '2-stage-paint-correction',
      'stage-3-paint-correction': '3-stage-paint-correction',
      'stage-1-ceramic-coating': '1-stage-ceramic-coating',
      'stage-2-ceramic-coating': '2-stage-ceramic-coating',
      'stage-3-ceramic-coating': '3-stage-ceramic-coating',
      'stage 1 paint correction': '1-stage-paint-correction',
      'stage 2 paint correction': '2-stage-paint-correction',
      'stage 3 paint correction': '3-stage-paint-correction',
      'stage 1 ceramic coating': '1-stage-ceramic-coating',
      'stage 2 ceramic coating': '2-stage-ceramic-coating',
      'stage 3 ceramic coating': '3-stage-ceramic-coating',
      // Handle additional ceramic coating variations
      'ceramic-coating-1-stage': '1-stage-ceramic-coating',
      'ceramic-coating-2-stage': '2-stage-ceramic-coating',
      'ceramic-coating-3-stage': '3-stage-ceramic-coating',
      'ceramic coating 1 stage': '1-stage-ceramic-coating',
      'ceramic coating 2 stage': '2-stage-ceramic-coating',
      'ceramic coating 3 stage': '3-stage-ceramic-coating',
    };
    
    const correctedKey = variations[key];
    if (correctedKey) {
      result = (serviceDefinitions as Record<string, unknown>)[correctedKey] as ServiceDefinition | null;
    }
  }
  
  // If still not found, try fuzzy matching by searching through all service definitions
  if (!result) {
    const serviceDefs = serviceDefinitions as Record<string, unknown>;
    for (const [, serviceDef] of Object.entries(serviceDefs)) {
      const service = serviceDef as { name?: string };
      if (service.name && service.name.toLowerCase() === serviceName.toLowerCase()) {
        result = service as ServiceDefinition;
        break;
      }
    }
  }
  
  // If still not found, try partial matching for ceramic coating and paint correction
  if (!result) {
    const serviceDefs = serviceDefinitions as Record<string, unknown>;
    const lowerServiceName = serviceName.toLowerCase();
    
    // Try to match ceramic coating variations
    if (lowerServiceName.includes('ceramic') && lowerServiceName.includes('coating')) {
      // Special handling for 3-5 year services (should map to 2-stage)
      if (lowerServiceName.includes('3-5') || lowerServiceName.includes('3-5-year')) {
        result = serviceDefs['2-stage-ceramic-coating'] as ServiceDefinition | null;
      } else if (lowerServiceName.includes('1') || lowerServiceName.includes('one')) {
        result = serviceDefs['1-stage-ceramic-coating'] as ServiceDefinition | null;
      } else if (lowerServiceName.includes('2') || lowerServiceName.includes('two')) {
        result = serviceDefs['2-stage-ceramic-coating'] as ServiceDefinition | null;
      } else if (lowerServiceName.includes('3') || lowerServiceName.includes('three')) {
        result = serviceDefs['3-stage-ceramic-coating'] as ServiceDefinition | null;
      }
    }
    
    // Try to match paint correction variations
    if (!result && lowerServiceName.includes('paint') && lowerServiceName.includes('correction')) {
      if (lowerServiceName.includes('1') || lowerServiceName.includes('one')) {
        result = serviceDefs['1-stage-paint-correction'] as ServiceDefinition | null;
      } else if (lowerServiceName.includes('2') || lowerServiceName.includes('two')) {
        result = serviceDefs['2-stage-paint-correction'] as ServiceDefinition | null;
      } else if (lowerServiceName.includes('3') || lowerServiceName.includes('three')) {
        result = serviceDefs['3-stage-paint-correction'] as ServiceDefinition | null;
      }
    }
  }
  
  return result;
};

// Helper function to get vehicle-specific features
export const getVehicleSpecificFeatures = (serviceDef: ServiceDefinition, vehicleType: string) => {
  if (!serviceDef.vehicles) return null;
  
  // Map frontend vehicle types to service definition keys
  const vehicleMap: { [key: string]: string } = {
    'car': 'car',
    'truck': 'truck', 
    'suv': 'truck', // SUVs use truck features
    'rv': 'rv',
    'boat': 'boat'
  };
  
  const mappedVehicle = vehicleMap[vehicleType] || 'car';
  return serviceDef.vehicles[mappedVehicle] || null;
};
