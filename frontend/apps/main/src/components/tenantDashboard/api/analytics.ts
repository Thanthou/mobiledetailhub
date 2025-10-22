import { useQuery } from '@tanstack/react-query';

export interface AnalyticsSummary {
  totalSessions: number;
  totalUsers: number;
  totalPageViews: number;
  averageBounceRate: number;
  averageSessionDuration: number;
  dailyData: Array<{
    date: string;
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: number;
    sessionDuration: number;
  }>;
  period: string;
  lastUpdated: string;
}

export interface RealtimeData {
  activeUsers: number;
  countries: Array<{
    country: string;
    users: number;
  }>;
  lastUpdated: string;
}

export interface GoogleAnalyticsStatus {
  connected: boolean;
  propertyId?: string;
  lastSync?: string;
  scopes?: string[];
}

/**
 * Hook to fetch Google Analytics connection status
 */
export function useGoogleAnalyticsStatus(tenantId?: number) {
  return useQuery<GoogleAnalyticsStatus>({
    queryKey: ['analytics', 'status', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/status?tenant_id=${tenantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics status');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to fetch Google Analytics summary data
 */
export function useAnalyticsSummary(tenantId?: number, days: number = 7) {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', 'summary', tenantId, days],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/summary?tenant_id=${tenantId}&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics summary');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch real-time analytics data
 */
export function useRealtimeData(tenantId?: number) {
  return useQuery<RealtimeData>({
    queryKey: ['analytics', 'realtime', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/realtime?tenant_id=${tenantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch realtime data');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!tenantId,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Function to initiate Google Analytics OAuth flow
 */
export function initiateGoogleAnalyticsAuth(tenantId: number): void {
  const authUrl = `/api/google/analytics/auth?tenant_id=${tenantId}`;
  window.open(authUrl, '_blank', 'width=600,height=700');
}
