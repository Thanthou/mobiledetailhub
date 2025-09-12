// MDH FAQ Data Exports
export { MDH_FAQ_AFTERCARE } from './aftercare';
export { MDH_FAQ_FLEET } from './fleet';
export { MDH_FAQ_GENERAL } from './general';
export { MDH_FAQ_LOCATIONS } from './locations';
export { MDH_FAQ_PAYMENTS } from './payments';
export { MDH_FAQ_PREPARATION } from './preparation';
export { MDH_FAQ_PRICING } from './pricing';
export { MDH_FAQ_SCHEDULING } from './scheduling';
export { MDH_FAQ_SERVICES } from './services';
export { MDH_FAQ_WARRANTY } from './warranty';

// Combined export
import type { FAQItem } from '../../types';
import {
  MDH_FAQ_AFTERCARE,
  MDH_FAQ_FLEET,
  MDH_FAQ_GENERAL,
  MDH_FAQ_LOCATIONS,
  MDH_FAQ_PAYMENTS,
  MDH_FAQ_PREPARATION,
  MDH_FAQ_PRICING,
  MDH_FAQ_SCHEDULING,
  MDH_FAQ_SERVICES,
  MDH_FAQ_WARRANTY,
} from './';

export const MDH_FAQ_ITEMS: FAQItem[] = [
  ...MDH_FAQ_SERVICES,
  ...MDH_FAQ_PRICING,
  ...MDH_FAQ_SCHEDULING,
  ...MDH_FAQ_LOCATIONS,
  ...MDH_FAQ_PREPARATION,
  ...MDH_FAQ_PAYMENTS,
  ...MDH_FAQ_WARRANTY,
  ...MDH_FAQ_AFTERCARE,
  ...MDH_FAQ_FLEET,
  ...MDH_FAQ_GENERAL,
];
