/**
 * Maid Service Preview Data Loader
 */

import type { IndustryPreviewData } from '../../preview-types';
import defaultsData from './defaults.json';

export function getMaidServicePreview(): IndustryPreviewData {
  return {
    business: {
      businessName: defaultsData.businessName,
      phone: defaultsData.phone,
      email: defaultsData.email,
      city: defaultsData.city,
      state: defaultsData.state,
    },
    reviews: defaultsData.reviews,
  };
}

export { defaultsData };

