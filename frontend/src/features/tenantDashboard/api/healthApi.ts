/**
 * API client for tenant dashboard health monitoring
 */

export interface HealthData {
  tenantSlug: string;
  hasData: boolean;
  lastUpdated?: string;
  performance?: {
    mobile?: PerformanceData;
    desktop?: PerformanceData;
  };
  overall?: {
    score: number;
    status: string;
    checkedAt: string;
    errorMessage?: string;
  };
  message?: string;
}

export interface PerformanceData {
  overallScore: number;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  coreWebVitals: {
    lcp: { value: number; score: number };
    fid: { value: number; score: number };
    cls: { value: number; score: number };
    fcp: { value: number; score: number };
    ttfb: { value: number; score: number };
  };
  metrics: {
    speedIndex: { value: number; score: number };
    interactive: { value: number; score: number };
    totalBlockingTime: { value: number; score: number };
  };
  status: string;
  checkedAt: string;
  opportunities: OptimizationOpportunity[];
  diagnostics: DiagnosticItem[];
  cruxData?: any;
}

export interface OptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  savings: number;
  savingsBytes: number;
}

export interface DiagnosticItem {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
}

export interface HealthHistoryItem {
  check_type: string;
  strategy: string;
  overall_score: number;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  status: string;
  checked_at: string;
}

export interface HealthHistoryResponse {
  success: boolean;
  data: {
    tenantSlug: string;
    history: HealthHistoryItem[];
    period: string;
    totalRecords: number;
  };
}

export interface HealthScanResponse {
  success: boolean;
  message: string;
  data: {
    tenantSlug: string;
    url: string;
    overallScore: number;
    summary: {
      status: string;
      priority: string[];
      recommendations: OptimizationOpportunity[];
    };
    timestamp: string;
  };
}

/**
 * Get current health status for a tenant
 */
export const getHealthStatus = async (tenantSlug: string): Promise<{ success: boolean; data: HealthData }> => {
  const response = await fetch(`/api/health-monitoring/${tenantSlug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Trigger a comprehensive health scan for a tenant
 */
export const triggerHealthScan = async (tenantSlug: string): Promise<HealthScanResponse> => {
  const response = await fetch(`/api/health-monitoring/${tenantSlug}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get health monitoring history for a tenant
 */
export const getHealthHistory = async (
  tenantSlug: string,
  options: { days?: number; limit?: number } = {}
): Promise<HealthHistoryResponse> => {
  const params = new URLSearchParams();
  
  if (options.days) params.append('days', options.days.toString());
  if (options.limit) params.append('limit', options.limit.toString());

  const response = await fetch(`/api/health-monitoring/${tenantSlug}/history?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Helper function to get score color based on value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
};

/**
 * Helper function to get score background color
 */
export const getScoreBgColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'healthy':
      return 'text-green-500 bg-green-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'critical':
      return 'text-red-600 bg-red-100';
    case 'error':
      return 'text-red-800 bg-red-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Helper function to format display values
 */
export const formatDisplayValue = (value: number | string | null | undefined, unit: string = ''): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Convert string to number if needed
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return 'N/A';
  
  if (unit === 'ms') {
    return `${Math.round(numericValue)}ms`;
  } else if (unit === 's') {
    return `${(numericValue / 1000).toFixed(2)}s`;
  } else if (unit === 'bytes') {
    if (numericValue > 1024 * 1024) {
      return `${(numericValue / (1024 * 1024)).toFixed(1)}MB`;
    } else if (numericValue > 1024) {
      return `${(numericValue / 1024).toFixed(1)}KB`;
    }
    return `${numericValue}B`;
  }
  
  return numericValue.toString();
};
