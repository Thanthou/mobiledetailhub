/**
 * Data Context Hooks
 * 
 * Hooks for accessing DataContext from anywhere in the app
 */

import { useContext } from 'react';

import { DataContext, type DataContextType } from '@/shared/contexts/DataContext';

/**
 * Hook to access tenant/business data from DataContext
 * Throws error if used outside DataProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { businessName, industry, slug } = useData();
 *   return <div>{businessName}</div>;
 * }
 * ```
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

/**
 * Optional version of useData that returns null if not in a provider
 * Useful for components that may or may not be wrapped in DataProvider
 * 
 * @example
 * ```tsx
 * function OptionalComponent() {
 *   const data = useDataOptional();
 *   if (!data) return <div>No tenant data available</div>;
 *   return <div>{data.businessName}</div>;
 * }
 * ```
 */
export const useDataOptional = (): DataContextType | null => {
  const context = useContext(DataContext);
  return context;
};

