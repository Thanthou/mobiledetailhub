// Service type definition
export interface ServiceDetails {
  title: string;
  description: string[];
  pricing?: string[];
  images: string[];
  videos?: string[];
}

// Service data definitions
const autoDetailingService: ServiceDetails = {
  title: 'Auto Detailing',
  description: [
    'Complete interior and exterior detailing',
    'Paint correction and protection',
    'Leather and fabric care',
    'Engine bay cleaning'
  ],
  pricing: ['Starting at $150'],
  images: ['/images/services/thumbnails/auto.png'],
  videos: []
};

const marineDetailingService: ServiceDetails = {
  title: 'Marine Detailing',
  description: [
    'Hull cleaning and waxing',
    'Interior upholstery care',
    'Canvas and vinyl protection',
    'Metal polishing'
  ],
  pricing: ['Starting at $200'],
  images: ['/images/services/thumbnails/boat.png'],
  videos: []
};

const rvDetailingService: ServiceDetails = {
  title: 'RV Detailing',
  description: [
    'Exterior wash and wax',
    'Interior deep cleaning',
    'Awning and canvas care',
    'Tire and wheel cleaning'
  ],
  pricing: ['Starting at $300'],
  images: ['/images/services/thumbnails/rv.png'],
  videos: []
};

// All services mapping
export const allServices: Record<string, ServiceDetails> = {
  'Auto Detailing': autoDetailingService,
  'Marine Detailing': marineDetailingService,
  'RV Detailing': rvDetailingService,
  // Add more services here as we create them
};

// Export the main Services component
export { default as Services } from './Services'; 