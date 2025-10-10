import { useState } from 'react';

import { executeQuery } from '../api/admin.api';
import type { QueryResult } from '../types';

/**
 * Hook for executing database queries
 */
export const useExecuteQuery = () => {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        throw new Error('No query entered');
      }

      const result = await executeQuery(trimmedQuery);
      setQueryResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    queryResult,
    isLoading,
    error,
    execute
  };
};

