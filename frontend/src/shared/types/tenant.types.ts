/**
 * Shared Tenant Context Types
 * 
 * This file defines the contract between frontend and backend for tenant context.
 * It ensures consistency across all layers and eliminates duplication.
 */

/**
 * Core tenant identification and basic info
 */
export interface TenantCore {
  id: string;
  slug: string;
  schema: string;
  domain: string;
  businessName: string;
}

/**
 * Extended tenant information for full context
 */
export interface TenantInfo extends TenantCore {
  owner: string;
  businessEmail: string | null;
  personalEmail: string;
  businessPhone: string;
  personalPhone: string;
  industry: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  businessStartDate: string;
  website: string;
  
  // Social media
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    googleBusiness?: string;
  };
  
  // Service areas
  serviceAreas: Array<{
    city: string;
    state: string;
    zip?: string;
    primary?: boolean;
    minimum?: number;
    multiplier?: number;
  }>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
}

/**
 * Tenant context for request/response handling
 */
export interface TenantContext {
  tenant: TenantInfo;
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    roles?: string[];
  };
  requestId?: string;
  correlationId?: string;
}

/**
 * Tenant validation result
 */
export interface TenantValidationResult {
  isValid: boolean;
  tenant?: TenantInfo;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}

/**
 * Tenant lookup options
 */
export interface TenantLookupOptions {
  bySlug?: string;
  byUserId?: string;
  byDomain?: string;
  isAdmin?: boolean;
  includeContent?: boolean;
}

/**
 * Tenant API response format
 */
export interface TenantApiResponse {
  success: boolean;
  data?: TenantInfo;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

/**
 * Tenant context provider props
 */
export interface TenantContextProviderProps {
  children: React.ReactNode;
  tenant?: TenantInfo;
  loading?: boolean;
  error?: Error | null;
}

/**
 * Hook return type for tenant context
 */
export interface UseTenantContextReturn {
  tenant: TenantInfo | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  isValid: boolean;
}

/**
 * Middleware options for tenant resolution
 */
export interface TenantMiddlewareOptions {
  requireApproval?: boolean;
  allowAdmin?: boolean;
  schemaSwitch?: boolean;
  validation?: 'strict' | 'loose';
}

/**
 * Tenant slug validation result
 */
export interface TenantSlugValidation {
  isValid: boolean;
  slug?: string;
  domain?: string;
  isMainSite?: boolean;
  isReserved?: boolean;
}

/**
 * Database schema information
 */
export interface TenantSchema {
  name: string;
  tables: string[];
  permissions: string[];
}

/**
 * Tenant analytics context
 */
export interface TenantAnalytics {
  tenantId: string;
  slug: string;
  sessionId?: string;
  pageViews: number;
  lastActivity: string;
  customEvents: Record<string, unknown>;
}