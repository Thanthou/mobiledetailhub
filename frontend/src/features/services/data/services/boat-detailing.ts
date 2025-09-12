import type { ServiceData } from '../../types/service';
import { marineDetailingData } from './marine-detailing';

// Boat detailing now uses the comprehensive marine detailing data
// This maintains backward compatibility while providing detailed content
export const boatDetailingData: ServiceData = {
  ...marineDetailingData,
  id: 'boat-detailing',
  title: 'Boat Detailing',
  action: {
    title: 'Ready to protect your boat?',
    description: ' ',
    bookLabel: 'Book Boat Detailing',
    quoteLabel: 'Get Quote'
  }
};
