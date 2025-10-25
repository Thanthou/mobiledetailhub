// Tenant business data from API
// Shared types for API responses

import type { Business as DBBusiness } from './generated/db.types';

/**
 * Business type - imported from auto-generated database types
 * Source: tenants.business table
 * 
 * Note: This is the raw database structure. For API responses that transform
 * the data (e.g., parsing JSONB fields), you may need to extend this type.
 */
export type Business = DBBusiness & {
  // Override service_areas to be strongly typed (DB stores as JSONB)
  service_areas: ServiceArea[];
};

export interface ServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

export interface BusinessResponse {
  success: boolean;
  data: Business;
}

