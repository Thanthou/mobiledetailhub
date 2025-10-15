/**
 * Protection comparison utilities for mobile detailing services
 * Used to compare wax, sealant, ceramic coating, and PPF protection options
 */

export type MetricKey = 'protection' | 'longevity' | 'ease' | 'chipResistance';

export type ProductKey = 'wax' | 'sealant' | 'ceramic' | 'ppf';

export type Ratings = Record<ProductKey, Record<MetricKey, 1|2|3|4|5>>;

export const DEFAULT_RATINGS: Ratings = {
  wax:      { protection: 1, longevity: 1, ease: 2, chipResistance: 1 },
  sealant:  { protection: 2, longevity: 2, ease: 2, chipResistance: 1 },
  ceramic:  { protection: 4, longevity: 4, ease: 4, chipResistance: 1 },
  ppf:      { protection: 5, longevity: 5, ease: 3, chipResistance: 5 },
};

export const METRIC_LABELS: Record<MetricKey, string> = {
  protection: 'Protection',
  longevity: 'Longevity',
  ease: 'Ease of Wash',
  chipResistance: 'Rock-Chip Resistance',
};

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  wax: 'Wax',
  sealant: 'Sealant',
  ceramic: 'Ceramic',
  ppf: 'PPF',
};

export const PRODUCT_COLORS: Record<ProductKey, string> = {
  wax: 'bg-amber-500',
  sealant: 'bg-blue-500',
  ceramic: 'bg-purple-500',
  ppf: 'bg-emerald-500',
};

