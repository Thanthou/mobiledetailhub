import { useCallback,useState } from 'react';

import type { DetailerData } from '../types';

export const useDashboardData = (initialData: DetailerData) => {
  const [detailerData, setDetailerData] = useState<DetailerData>(initialData);

  const updateDetailerData = useCallback((updates: Partial<DetailerData>) => {
    setDetailerData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetDetailerData = useCallback(() => {
    setDetailerData(initialData);
  }, [initialData]);

  return {
    detailerData,
    updateDetailerData,
    resetDetailerData
  };
};