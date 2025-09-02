// Service type definition
export interface ServiceDetails {
  title: string;
  description: string[];
  pricing?: string[];
  images: string[];
  videos?: string[];
}

// Import service data
import { autoDetailingService } from './AutoDetailing';
import { marineDetailingService } from './MarineDetailing';
import { rvDetailingService } from './RVDetailing';

// All services mapping
export const allServices: Record<string, ServiceDetails> = {
  'Auto Detailing': autoDetailingService,
  'Marine Detailing': marineDetailingService,
  'RV Detailing': rvDetailingService,
  // Add more services here as we create them
};

// Modal components
export { default as AutoDetailingModal } from './AutoDetailing';
export { default as MarineDetailingModal } from './MarineDetailing';
export { default as RVDetailingModal } from './RVDetailing'; 