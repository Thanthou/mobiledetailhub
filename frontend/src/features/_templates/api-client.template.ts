/**
 * Feature API Client Template
 * Copy this template when creating a new feature's API layer
 * 
 * Location: features/<your-feature>/api/<your-feature>.api.ts
 * 
 * Pattern:
 * - All HTTP calls for this feature go here
 * - Export an object with methods (not a class unless needed)
 * - Use shared apiClient for auth/error handling
 * - Keep functions focused and named clearly
 * - Return typed responses
 * 
 * Components should NEVER import this directly.
 * Components consume hooks, hooks use this API client.
 */

import { apiClient } from '@/shared/api';

/**
 * Response types for this feature
 * Co-locate with API methods or in ../types/ if complex
 */
interface YourFeatureItem {
  id: string | number;
  // Add your item properties here
}

interface YourFeatureResponse {
  success: boolean;
  data?: YourFeatureItem[];
  error?: string;
}

/**
 * API client for YourFeature
 * 
 * Usage (in hooks, NOT components):
 * ```typescript
 * import { yourFeatureApi } from '../api/yourFeature.api';
 * 
 * // In a hook
 * const data = await yourFeatureApi.getItems();
 * ```
 */
export const yourFeatureApi = {
  /**
   * Get items
   */
  getItems: async (params?: { filter?: string }): Promise<YourFeatureResponse> => {
    const queryString = params?.filter ? `?filter=${params.filter}` : '';
    return apiClient.get(`/your-feature/items${queryString}`);
  },
  
  /**
   * Get single item by ID
   */
  getItem: async (id: string | number): Promise<YourFeatureResponse> => {
    return apiClient.get(`/your-feature/items/${String(id)}`);
  },
  
  /**
   * Create new item
   */
  createItem: async (data: Partial<YourFeatureItem>): Promise<YourFeatureResponse> => {
    return apiClient.post('/your-feature/items', data);
  },
  
  /**
   * Update item
   */
  updateItem: async (id: string | number, data: Partial<YourFeatureItem>): Promise<YourFeatureResponse> => {
    return apiClient.patch(`/your-feature/items/${String(id)}`, data);
  },
  
  /**
   * Delete item
   */
  deleteItem: async (id: string | number): Promise<YourFeatureResponse> => {
    return apiClient.delete(`/your-feature/items/${String(id)}`);
  },
};

/**
 * React Query cache keys for this feature
 * Keeps cache keys consistent and typed
 */
interface YourFeatureFilters {
  filter?: string;
  // Add your filter properties here
}

export const yourFeatureKeys = {
  all: ['yourFeature'] as const,
  lists: () => [...yourFeatureKeys.all, 'list'] as const,
  list: (filters?: YourFeatureFilters) => [...yourFeatureKeys.lists(), filters] as const,
  details: () => [...yourFeatureKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...yourFeatureKeys.details(), id] as const,
};

