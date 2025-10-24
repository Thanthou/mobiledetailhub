/**
 * Mobile Detailing Preview Data Loader
 * 
 * Loads all preview data from a single defaults.json file.
 * Services use the industry config (servicesGrid), FAQs use the existing FAQ loader.
 */

import type { IndustryPreviewData } from '../../preview-types';
import defaultsData from './defaults.json';
import mockReviews from '../../shared/mock-reviews.json';

export function getMobileDetailingPreview(): IndustryPreviewData {
  return {
    business: {
      businessName: defaultsData.businessName,
      phone: defaultsData.phone,
      email: defaultsData.email,
      city: defaultsData.city,
      state: defaultsData.state,
    },
    reviews: mockReviews,
  };
}

// Re-export for convenience
export { defaultsData };

