/**
 * Hook Template - Using API Client
 * 
 * Pattern:
 * - Hooks contain side effects (API calls, subscriptions, etc.)
 * - Hooks use API clients (not fetch directly)
 * - Hooks use React Query for server state
 * - Components consume hooks, never API clients directly
 * 
 * Location: features/<your-feature>/hooks/useYourFeatureData.ts
 * 
 * Instructions:
 * 1. Replace YourFeatureType with your actual feature type
 * 2. Replace YourFeatureInput/UpdateInput with your input types
 * 3. Import your actual API client and query keys
 * 4. Uncomment the import line and customize it
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, eslint-comments/require-description -- Template file with placeholder types that will be replaced during implementation */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Uncomment and customize this import:
// import { yourFeatureApi, yourFeatureKeys } from '../api/yourFeature.api';
// import type { YourFeatureType, YourFeatureInput, YourFeatureUpdateInput } from '../types/yourFeature.types';

/**
 * Hook to load a single feature item
 * 
 * Usage (in components):
 * ```typescript
 * import { useYourFeatureItem } from '../hooks/useYourFeatureData';
 * 
 * function MyComponent({ id }: { id: string }) {
 *   const { data, isLoading, error } = useYourFeatureItem(id);
 *   // ...
 * }
 * ```
 */
export function useYourFeatureItem<TData = unknown>(id: string | number) {
  // Replace with your actual API client and keys
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Template placeholder, replace with actual API client
  const yourFeatureApi = {} as any;
  const yourFeatureKeys = { 
    detail: (id: string | number) => ['yourFeature', id],
  } as const;

  return useQuery({
    queryKey: yourFeatureKeys.detail(id),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Template placeholder, replace with actual API method
    queryFn: () => (yourFeatureApi.getItem as (id: string | number) => Promise<TData>)(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,     // 10 minutes
  });
}

/**
 * Hook to load all feature items
 * 
 * Usage (in components):
 * ```typescript
 * import { useYourFeatureList } from '../hooks/useYourFeatureData';
 * 
 * function MyComponent() {
 *   const { data, isLoading, error } = useYourFeatureList();
 *   // ...
 * }
 * ```
 */
export function useYourFeatureList<TData = unknown>() {
  // Replace with your actual API client and keys
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Template placeholder, replace with actual API client
  const yourFeatureApi = {} as any;
  const yourFeatureKeys = { 
    all: ['yourFeature'],
  } as const;

  return useQuery({
    queryKey: yourFeatureKeys.all,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Template placeholder, replace with actual API method
    queryFn: () => (yourFeatureApi.getItems as () => Promise<TData[]>)(),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,     // 10 minutes
  });
}

/**
 * Hook to create feature data
 */
export function useYourFeatureMutation<TInput = unknown, TData = unknown>() {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Template placeholder, replace with actual API client
  const yourFeatureApi = {} as any;
  const yourFeatureKeys = { all: ['yourFeature'] } as const;
  
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Template placeholder, replace with actual API method
    mutationFn: (data: TInput) => (yourFeatureApi.createItem as (data: TInput) => Promise<TData>)(data),
    onSuccess: () => {
      // Invalidate cache to refetch fresh data
      void queryClient.invalidateQueries({ queryKey: yourFeatureKeys.all });
    },
  });
}

/**
 * Hook to update feature data
 */
export function useUpdateYourFeature<TInput = unknown, TData = unknown>(id: string | number) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Template placeholder, replace with actual API client
  const yourFeatureApi = {} as any;
  const yourFeatureKeys = { 
    detail: (id: string | number) => ['yourFeature', id],
    lists: () => ['yourFeature', 'lists'],
  } as const;
  
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Template placeholder, replace with actual API method
    mutationFn: (data: TInput) => (yourFeatureApi.updateItem as (id: string | number, data: TInput) => Promise<TData>)(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: yourFeatureKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: yourFeatureKeys.lists() });
    },
  });
}

/**
 * Hook to delete feature data
 */
export function useDeleteYourFeature() {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Template placeholder, replace with actual API client
  const yourFeatureApi = {} as any;
  const yourFeatureKeys = { all: ['yourFeature'] } as const;
  
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Template placeholder, replace with actual API method
    mutationFn: (id: string | number) => (yourFeatureApi.deleteItem as (id: string | number) => Promise<void>)(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: yourFeatureKeys.all });
    },
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, eslint-comments/require-description -- End of template file */
