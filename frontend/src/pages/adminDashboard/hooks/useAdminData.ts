import { useState, useCallback } from 'react';
import type { AdminData, QueryHistory, QueryResult } from '../types';

export const useAdminData = (initialData: Partial<AdminData> = {}) => {
  const [adminData, setAdminData] = useState<AdminData>({
    isLiveDatabase: true,
    queryHistory: [
      {
        id: '1',
        query: 'SELECT COUNT(*) FROM users;',
        timestamp: new Date(Date.now() - 300000),
        success: true,
        executionTime: 45
      },
      {
        id: '2',
        query: 'SELECT * FROM orders WHERE status = "pending";',
        timestamp: new Date(Date.now() - 600000),
        success: true,
        executionTime: 120
      }
    ],
    ...initialData
  });

  const updateAdminData = useCallback((data: Partial<AdminData>) => {
    setAdminData(prev => ({ ...prev, ...data }));
  }, []);

  const addQueryHistory = useCallback((historyItem: QueryHistory) => {
    setAdminData(prev => ({
      ...prev,
      queryHistory: [historyItem, ...prev.queryHistory.slice(0, 9)]
    }));
  }, []);

  return {
    adminData,
    updateAdminData,
    addQueryHistory
  };
};
