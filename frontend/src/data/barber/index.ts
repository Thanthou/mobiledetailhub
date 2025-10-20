/**
 * Barber Industry Data Exports
 * 
 * Provides default content, SEO, and service data for barber shop tenants
 */

import contentDefaults from './content-defaults.json';
import seoDefaults from './seo-defaults.json';
import assets from './assets.json';
import servicesDefaults from './defaults/services.json';
import metadata from './defaults/metadata.json';
import faq from './defaults/faq.json';

export const barberDefaults = {
  content: contentDefaults,
  seo: seoDefaults,
  assets,
  services: servicesDefaults.services,
  metadata,
  faq: faq.categories,
};

export default barberDefaults;

