// Affiliate FAQ Data Exports
export { AFFILIATE_FAQ_SERVICES } from './services';
export { AFFILIATE_FAQ_PRICING } from './pricing';
export { AFFILIATE_FAQ_SCHEDULING } from './scheduling';
export { AFFILIATE_FAQ_LOCATIONS } from './locations';
export { AFFILIATE_FAQ_PREPARATION } from './preparation';
export { AFFILIATE_FAQ_PAYMENTS } from './payments';
export { AFFILIATE_FAQ_WARRANTY } from './warranty';
export { AFFILIATE_FAQ_AFTERCARE } from './aftercare';
export { AFFILIATE_FAQ_FLEET } from './fleet';
export { AFFILIATE_FAQ_GENERAL } from './general';

// Combined export
import { FAQItem } from '../../types';
import {
  AFFILIATE_FAQ_SERVICES,
  AFFILIATE_FAQ_PRICING,
  AFFILIATE_FAQ_SCHEDULING,
  AFFILIATE_FAQ_LOCATIONS,
  AFFILIATE_FAQ_PREPARATION,
  AFFILIATE_FAQ_PAYMENTS,
  AFFILIATE_FAQ_WARRANTY,
  AFFILIATE_FAQ_AFTERCARE,
  AFFILIATE_FAQ_FLEET,
  AFFILIATE_FAQ_GENERAL,
} from './';

export const AFFILIATE_FAQ_ITEMS = (cfg: any): FAQItem[] => [
  ...AFFILIATE_FAQ_SERVICES(cfg),
  ...AFFILIATE_FAQ_PRICING(cfg),
  ...AFFILIATE_FAQ_SCHEDULING(cfg),
  ...AFFILIATE_FAQ_LOCATIONS(cfg),
  ...AFFILIATE_FAQ_PREPARATION(cfg),
  ...AFFILIATE_FAQ_PAYMENTS(cfg),
  ...AFFILIATE_FAQ_WARRANTY(cfg),
  ...AFFILIATE_FAQ_AFTERCARE(cfg),
  ...AFFILIATE_FAQ_FLEET(cfg),
  ...AFFILIATE_FAQ_GENERAL(cfg),
];