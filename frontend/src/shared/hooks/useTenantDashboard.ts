/**
 * Tenant Dashboard Hooks
 * 
 * React hooks for accessing tenant dashboard analytics and aggregated data.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTenantContext } from '@/shared/contexts/TenantContext';
import {
  getTenantDashboard,
  getTenantOverview,
  getTenantReviews,
  getTenantPerformance,
  getTenantActivity,
  type DashboardApiOptions,
  type DashboardAnalytics,
  type TenantOverview,
  type ReviewAnalytics,
  type PerformanceAnalytics,
  type ActivityAnalytics
} from '@/shared/api/tenantDashboardApi';

/**
 * Hook to get comprehensive tenant dashboard analytics
 */
export function useTenantDashboard(options: DashboardApiOptions = {}) {
  const { tenantSlug } = useTenantContext();

  return useQuery({
    queryKey: ['tenant-dashboard', tenantSlug, options.dateRange, options.includeDetails],
    queryFn: () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }
      return getTenantDashboard(tenantSlug, options);
    },
    enabled: !!tenantSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get tenant overview statistics
 */
export function useTenantOverview(dateRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  const { tenantSlug } = useTenantContext();

  return useQuery({
    queryKey: ['tenant-overview', tenantSlug, dateRange],
    queryFn: () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }
      return getTenantOverview(tenantSlug, dateRange);
    },
    enabled: !!tenantSlug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get detailed review analytics
 */
export function useTenantReviews(options: DashboardApiOptions = {}) {
  const { tenantSlug } = useTenantContext();

  return useQuery({
    queryKey: ['tenant-reviews', tenantSlug, options.dateRange, options.limit, options.offset],
    queryFn: () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }
      return getTenantReviews(tenantSlug, options);
    },
    enabled: !!tenantSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to get performance analytics
 */
export function useTenantPerformance(dateRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  const { tenantSlug } = useTenantContext();

  return useQuery({
    queryKey: ['tenant-performance', tenantSlug, dateRange],
    queryFn: () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }
      return getTenantPerformance(tenantSlug, dateRange);
    },
    enabled: !!tenantSlug,
    staleTime: 15 * 60 * 1000, // 15 minutes (performance data changes less frequently)
    retry: 2,
  });
}

/**
 * Hook to get recent activity summary
 */
export function useTenantActivity(options: DashboardApiOptions = {}) {
  const { tenantSlug } = useTenantContext();

  return useQuery({
    queryKey: ['tenant-activity', tenantSlug, options.dateRange, options.limit],
    queryFn: () => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required');
      }
      return getTenantActivity(tenantSlug, options);
    },
    enabled: !!tenantSlug,
    staleTime: 2 * 60 * 1000, // 2 minutes (activity data changes frequently)
    retry: 2,
  });
}

/**
 * Hook to get dashboard health score
 */
export function useDashboardHealth(dateRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  const { data: dashboard, isLoading, error } = useTenantDashboard({ dateRange });

  return {
    healthScore: dashboard?.summary?.overallHealth || 0,
    insights: dashboard?.summary?.insights || [],
    recommendations: dashboard?.summary?.recommendations || [],
    isLoading,
    error,
  };
}

/**
 * Hook to get dashboard summary with quick stats
 */
export function useDashboardSummary(dateRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  const { data: overview, isLoading: overviewLoading } = useTenantOverview(dateRange);
  const { data: reviews, isLoading: reviewsLoading } = useTenantReviews({ dateRange });
  const { data: activity, isLoading: activityLoading } = useTenantActivity({ dateRange });

  const isLoading = overviewLoading || reviewsLoading || activityLoading;

  return {
    overview,
    recentReviews: reviews?.recentReviews || [],
    recentActivity: activity?.activities || [],
    isLoading,
    summary: {
      totalReviews: overview?.totalReviews || 0,
      averageRating: overview?.averageRating || 0,
      recentReviews: overview?.recentReviews || 0,
      totalActivities: activity?.totalActivities || 0,
      reviewTrend: overview?.reviewTrend || 'new',
    },
  };
}

/**
 * Hook to refresh all dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  const { tenantSlug } = useTenantContext();

  const refreshAll = () => {
    if (!tenantSlug) return;

    // Invalidate all dashboard-related queries
    queryClient.invalidateQueries({
      queryKey: ['tenant-dashboard', tenantSlug],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-overview', tenantSlug],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-reviews', tenantSlug],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-performance', tenantSlug],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-activity', tenantSlug],
    });
  };

  const refreshByDateRange = (dateRange: '7d' | '30d' | '90d' | '1y') => {
    if (!tenantSlug) return;

    // Invalidate queries for specific date range
    queryClient.invalidateQueries({
      queryKey: ['tenant-dashboard', tenantSlug, dateRange],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-overview', tenantSlug, dateRange],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-reviews', tenantSlug, dateRange],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-performance', tenantSlug, dateRange],
    });
    queryClient.invalidateQueries({
      queryKey: ['tenant-activity', tenantSlug, dateRange],
    });
  };

  return {
    refreshAll,
    refreshByDateRange,
  };
}

/**
 * Hook to get dashboard loading states
 */
export function useDashboardLoadingStates() {
  const dashboardQuery = useTenantDashboard();
  const overviewQuery = useTenantOverview();
  const reviewsQuery = useTenantReviews();
  const performanceQuery = useTenantPerformance();
  const activityQuery = useTenantActivity();

  return {
    dashboard: dashboardQuery.isLoading,
    overview: overviewQuery.isLoading,
    reviews: reviewsQuery.isLoading,
    performance: performanceQuery.isLoading,
    activity: activityQuery.isLoading,
    anyLoading: dashboardQuery.isLoading || 
                overviewQuery.isLoading || 
                reviewsQuery.isLoading || 
                performanceQuery.isLoading || 
                activityQuery.isLoading,
  };
}

/**
 * Hook to get dashboard error states
 */
export function useDashboardErrors() {
  const dashboardQuery = useTenantDashboard();
  const overviewQuery = useTenantOverview();
  const reviewsQuery = useTenantReviews();
  const performanceQuery = useTenantPerformance();
  const activityQuery = useTenantActivity();

  const errors = [];
  if (dashboardQuery.error) errors.push({ source: 'dashboard', error: dashboardQuery.error });
  if (overviewQuery.error) errors.push({ source: 'overview', error: overviewQuery.error });
  if (reviewsQuery.error) errors.push({ source: 'reviews', error: reviewsQuery.error });
  if (performanceQuery.error) errors.push({ source: 'performance', error: performanceQuery.error });
  if (activityQuery.error) errors.push({ source: 'activity', error: activityQuery.error });

  return {
    errors,
    hasErrors: errors.length > 0,
    getErrorBySource: (source: string) => errors.find(e => e.source === source)?.error,
  };
}
