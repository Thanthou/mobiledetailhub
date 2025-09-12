export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
  executionTime: number;
}

export interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  success: boolean;
  executionTime?: number;
}

export type AdminTab = 'database' | 'users' | 'reviews' | 'analytics' | 'settings';

export type UserSubTab = 'all-users' | 'admin' | 'affiliates' | 'customers' | 'pending';

export interface AdminData {
  isLiveDatabase: boolean;
  queryHistory: QueryHistory[];
}
