/**
 * Tenant Dashboard API Client
 * 
 * Provides typed API calls for tenant dashboard analytics and aggregated data.
 */

import { apiClient } from './apiClient';

/**
 * Dashboard analytics response types
 */
export interface DashboardAnalytics {
  tenant: {
    id: string;
    dateRange: string;
    generatedAt: string;
  };
  overview: TenantOverview;
  reviews: ReviewAnalytics;
  performance: PerformanceAnalytics;
  activity: ActivityAnalytics;
  services: ServiceAnalytics;
  summary: DashboardSummary;
  meta: {
    requestId: string;
    generatedAt: string;
    tenantSlug: string;
    dateRange: string;
    includeDetails: boolean;
  };
}

export interface TenantOverview {
  id: string;
  slug: string;
  businessName: string;
  industry: string;
  status: string;
  createdAt: string;
  lastActivity: string;
  totalReviews: number;
  averageRating: number;
  recentReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  reviewTrend: 'new' | 'increasing' | 'stable' | 'decreasing';
}

export interface ReviewAnalytics {
  distribution: Array<{
    rating: number;
    count: number;
  }>;
  recentReviews: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
    source: string;
  }>;
  trends: Array<{
    month: string;
    reviewCount: number;
    averageRating: number;
  }>;
}

export interface PerformanceAnalytics {
  websitePerformance: {
    pageLoadTime: number;
    mobileScore: number;
    desktopScore: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
  seoScore: {
    overall: number;
    technical: number;
    content: number;
    backlinks: number;
  };
  socialMedia: {
    facebook: { followers: number; engagement: number };
    instagram: { followers: number; engagement: number };
    google: { reviews: number; rating: number };
  };
}

export interface ActivityAnalytics {
  activities: Array<{
    type: string;
    title: string;
    description: string;
    rating?: number;
    timestamp: string;
  }>;
  totalActivities: number;
}

export interface ServiceAnalytics {
  categories: Array<{
    category: string;
    totalServices: number;
    activeServices: number;
  }>;
  totalServices: number;
  activeServices: number;
}

export interface DashboardSummary {
  insights: Array<{
    type: 'positive' | 'warning' | 'info';
    category: string;
    message: string;
  }>;
  overallHealth: number;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
  }>;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardAnalytics;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

/**
 * Dashboard API options
 */
export interface DashboardApiOptions {
  dateRange?: '7d' | '30d' | '90d' | '1y';
  includeDetails?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Get comprehensive tenant dashboard analytics
 */
export async function getTenantDashboard(
  tenantSlug: string,
  options: DashboardApiOptions = {}
): Promise<DashboardAnalytics> {
  const { dateRange = '30d', includeDetails = false } = options;
  
  const params = new URLSearchParams({
    dateRange,
    includeDetails: includeDetails.toString()
  });

  const response = await apiClient.get<DashboardApiResponse>(
    `/dashboard/${tenantSlug}/dashboard?${params}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch dashboard analytics');
  }

  return response.data.data;
}

/**
 * Get tenant overview statistics
 */
export async function getTenantOverview(
  tenantSlug: string,
  dateRange: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<TenantOverview> {
  const response = await apiClient.get<DashboardApiResponse>(
    `/dashboard/${tenantSlug}/dashboard/overview?dateRange=${dateRange}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch tenant overview');
  }

  return response.data.data as TenantOverview;
}

/**
 * Get detailed review analytics
 */
export async function getTenantReviews(
  tenantSlug: string,
  options: DashboardApiOptions = {}
): Promise<ReviewAnalytics> {
  const { dateRange = '30d', limit = 10, offset = 0 } = options;
  
  const params = new URLSearchParams({
    dateRange,
    limit: limit.toString(),
    offset: offset.toString()
  });

  const response = await apiClient.get<DashboardApiResponse>(
    `/dashboard/${tenantSlug}/dashboard/reviews?${params}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch review analytics');
  }

  return response.data.data as ReviewAnalytics;
}

/**
 * Get performance analytics
 */
export async function getTenantPerformance(
  tenantSlug: string,
  dateRange: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<PerformanceAnalytics> {
  const response = await apiClient.get<DashboardApiResponse>(
    `/dashboard/${tenantSlug}/dashboard/performance?dateRange=${dateRange}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch performance analytics');
  }

  return response.data.data as PerformanceAnalytics;
}

/**
 * Get recent activity summary
 */
export async function getTenantActivity(
  tenantSlug: string,
  options: DashboardApiOptions = {}
): Promise<ActivityAnalytics> {
  const { dateRange = '30d', limit = 20 } = options;
  
  const params = new URLSearchParams({
    dateRange,
    limit: limit.toString()
  });

  const response = await apiClient.get<DashboardApiResponse>(
    `/dashboard/${tenantSlug}/dashboard/activity?${params}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch activity analytics');
  }

  return response.data.data as ActivityAnalytics;
}
