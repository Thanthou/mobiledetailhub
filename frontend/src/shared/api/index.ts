export type { 
  AffiliateApplication,
  AffiliateApprovalResponse,
  AffiliateDeletionResponse,
  AffiliateRejectionResponse,
  ApiResponse, 
  ApplicationsResponse,
  LoginResponse,
  QuoteFormData, 
  RefreshResponse,
  User, 
  UsersResponse
} from './api';
export { apiService } from './api';
export { ApiClient,apiClient } from './apiClient';
export { ApiClient as ApiClientClass, apiClient as apiClientInstance } from './client';
export * from './errors';

// Tenant config API
export {
  fetchTenantConfigById,
  fetchTenantConfigBySlug,
  fetchTenants,
  tenantConfigKeys
} from './tenantConfig.api';

// Tenant API
export type { Business, BusinessResponse, ServiceArea, Tenant, TenantApiResponse, TenantsListResponse } from './tenantApi';
export {
  fetchBusinessBySlug,
  fetchTenantBySlug,
  fetchTenantsByIndustry,
  getIndustryAssetsPath,
  getIndustryDataPath,
  getIndustrySiteConfigPath
} from './tenantApi';

// Industry Config API
export { fetchIndustryConfig } from './industryConfigApi';