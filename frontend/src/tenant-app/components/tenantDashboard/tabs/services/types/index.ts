import type { ComponentType } from 'react';

import type { Service as _CentralService, Service, ServiceTier as CentralServiceTier } from '@/shared/types';

/**
 * Re-export centralized Service and ServiceTier types
 * This prevents duplication and ensures consistency across verticals
 */
export type { Service, ServiceCatalog,ServiceCategory, ServiceTier, VehicleType } from '@/shared/types';

/**
 * Legacy compatibility: Service tier with price in dollars instead of cents
 * @deprecated Use ServiceTier from @/shared/types and convert using priceCents
 */
export interface LegacyServiceTier {
  id: string;
  name: string;
  price: number;                   // Price in dollars (legacy)
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

/**
 * Helper to convert from centralized ServiceTier to legacy format
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated -- Helper function for legacy compatibility
export function toWLegacyServiceTier(tier: CentralServiceTier): LegacyServiceTier {
  return {
    id: String(tier.id),
    name: tier.name,
    price: tier.priceCents / 100,  // Convert cents to dollars
    duration: tier.durationMinutes,
    features: tier.features,
    enabled: tier.enabled ?? true,
    popular: tier.popular
  };
}

/**
 * Helper to convert from legacy format to centralized ServiceTier
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated -- Helper function for legacy compatibility
export function fromLegacyServiceTier(legacy: LegacyServiceTier): CentralServiceTier {
  return {
    id: legacy.id,
    name: legacy.name,
    priceCents: Math.round(legacy.price * 100),  // Convert dollars to cents
    durationMinutes: legacy.duration,
    description: '',
    features: legacy.features,
    enabled: legacy.enabled,
    popular: legacy.popular
  };
}

export interface Subcategory {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  services: Service[];
  subcategories?: Subcategory[];
}

export interface Vehicle {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  categories: Category[];
}