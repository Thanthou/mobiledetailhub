export interface QueryResult {
  columns: string[];
  rows: any[][];
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

export type AdminTab = 'database' | 'users' | 'analytics' | 'settings';

export type UserSubTab = 'all-users' | 'admin' | 'affiliates' | 'clients' | 'pending';

export interface AdminData {
  isLiveDatabase: boolean;
  queryHistory: QueryHistory[];
}
