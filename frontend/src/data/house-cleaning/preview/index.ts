/**
 * House Cleaning Preview Data Loader
 */

import type { IndustryPreviewData } from '../../preview-types';
import defaultsData from './content.json';
import mockReviews from '../../shared/mock-reviews.json';

export function getHouseCleaningPreview(): IndustryPreviewData {
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

export { defaultsData };

