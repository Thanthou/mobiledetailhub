/**
 * Frontend Error Tracking Service
 * 
 * Provides unified error tracking and reporting from frontend to backend.
 * Integrates with the backend unified error service for comprehensive error monitoring.
 */

import { apiClient } from '@/shared/api/apiClient';
import { useTenantContext } from '@/shared/contexts/TenantContext';
import { useAuth } from '@/shared/contexts/AuthContext';

/**
 * Error severity levels (matching backend)
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

/**
 * Error categories (matching backend)
 */
export const ERROR_CATEGORY = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  DATABASE: 'database',
  NETWORK: 'network',
  BUSINESS_LOGIC: 'business_logic',
  SYSTEM: 'system',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  USER_INPUT: 'user_input',
  FRONTEND: 'frontend'
} as const;

/**
 * Frontend error interface
 */
export interface FrontendError {
  message: string;
  code: string;
  severity: keyof typeof ERROR_SEVERITY;
  category: keyof typeof ERROR_CATEGORY;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  tenantId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  correlationId?: string;
}

/**
 * Error tracking service class
 */
class ErrorTrackingService {
  private sessionId: string;
  private errorQueue: FrontendError[] = [];
  private maxQueueSize = 50;
  private flushInterval: number | null = null;
  private isOnline = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupOnlineDetection();
    this.setupPeriodicFlush();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup online/offline detection
   */
  private setupOnlineDetection(): void {
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Setup periodic error queue flushing
   */
  private setupPeriodicFlush(): void {
    // Flush errors every 30 seconds
    this.flushInterval = window.setInterval(() => {
      if (this.isOnline && this.errorQueue.length > 0) {
        this.flushErrorQueue();
      }
    }, 30000);
  }

  /**
   * Track an error
   */
  trackError(error: Error | string, options: Partial<FrontendError> = {}): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    const frontendError: FrontendError = {
      message: errorMessage,
      code: options.code || 'FRONTEND_ERROR',
      severity: options.severity || 'MEDIUM',
      category: options.category || 'FRONTEND',
      stack: errorStack,
      componentStack: options.componentStack,
      metadata: options.metadata || {},
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      correlationId: options.correlationId,
      ...options
    };

    // Add to queue
    this.errorQueue.push(frontendError);

    // Trim queue if too large
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Try to flush immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Frontend Error Tracked:', frontendError);
    }
  }

  /**
   * Track React component error
   */
  trackComponentError(error: Error, errorInfo: React.ErrorInfo, componentName?: string): void {
    this.trackError(error, {
      code: 'COMPONENT_ERROR',
      severity: 'HIGH',
      category: 'FRONTEND',
      componentStack: errorInfo.componentStack,
      metadata: {
        componentName,
        errorBoundary: true,
        errorInfo: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }

  /**
   * Track API error
   */
  trackApiError(error: Error, endpoint: string, method: string, status?: number): void {
    this.trackError(error, {
      code: 'API_ERROR',
      severity: status && status >= 500 ? 'HIGH' : 'MEDIUM',
      category: 'NETWORK',
      metadata: {
        endpoint,
        method,
        status,
        apiError: true
      }
    });
  }

  /**
   * Track validation error
   */
  trackValidationError(message: string, field: string, value: unknown): void {
    this.trackError(new Error(message), {
      code: 'VALIDATION_ERROR',
      severity: 'LOW',
      category: 'VALIDATION',
      metadata: {
        field,
        value: typeof value === 'object' ? '[object]' : String(value),
        validationError: true
      }
    });
  }

  /**
   * Track performance issue
   */
  trackPerformanceIssue(operation: string, duration: number, threshold: number): void {
    this.trackError(new Error(`Performance issue: ${operation} took ${duration}ms (threshold: ${threshold}ms)`), {
      code: 'PERFORMANCE_ISSUE',
      severity: 'MEDIUM',
      category: 'PERFORMANCE',
      metadata: {
        operation,
        duration,
        threshold,
        performanceIssue: true
      }
    });
  }

  /**
   * Track user action error
   */
  trackUserActionError(action: string, error: Error, context?: Record<string, unknown>): void {
    this.trackError(error, {
      code: 'USER_ACTION_ERROR',
      severity: 'MEDIUM',
      category: 'USER_INPUT',
      metadata: {
        action,
        userAction: true,
        ...context
      }
    });
  }

  /**
   * Flush error queue to backend
   */
  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) {
      return;
    }

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await apiClient.post('/api/errors/track', {
        errors: errorsToSend,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (flushError) {
      // Re-add errors to queue if flush failed
      this.errorQueue.unshift(...errorsToSend);
      
      // Log flush error (but don't track it to avoid infinite loops)
      console.error('Failed to flush error queue:', flushError);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    recentErrors: FrontendError[];
  } {
    const errorsByCategory: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    this.errorQueue.forEach(error => {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });

    return {
      totalErrors: this.errorQueue.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors: this.errorQueue.slice(-10)
    };
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Destroy service (cleanup)
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Flush remaining errors
    if (this.isOnline && this.errorQueue.length > 0) {
      this.flushErrorQueue();
    }
  }
}

// Create singleton instance
export const errorTrackingService = new ErrorTrackingService();

// React hook for error tracking
export const useErrorTracking = () => {
  const { tenantId, tenantSlug } = useTenantContext();
  const { user } = useAuth();

  const trackError = (error: Error | string, options: Partial<FrontendError> = {}) => {
    errorTrackingService.trackError(error, {
      ...options,
      tenantId,
      userId: user?.id
    });
  };

  const trackComponentError = (error: Error, errorInfo: React.ErrorInfo, componentName?: string) => {
    errorTrackingService.trackComponentError(error, errorInfo, componentName);
  };

  const trackApiError = (error: Error, endpoint: string, method: string, status?: number) => {
    errorTrackingService.trackApiError(error, endpoint, method, status);
  };

  const trackValidationError = (message: string, field: string, value: unknown) => {
    errorTrackingService.trackValidationError(message, field, value);
  };

  const trackPerformanceIssue = (operation: string, duration: number, threshold: number) => {
    errorTrackingService.trackPerformanceIssue(operation, duration, threshold);
  };

  const trackUserActionError = (action: string, error: Error, context?: Record<string, unknown>) => {
    errorTrackingService.trackUserActionError(action, error, context);
  };

  return {
    trackError,
    trackComponentError,
    trackApiError,
    trackValidationError,
    trackPerformanceIssue,
    trackUserActionError,
    getErrorStats: errorTrackingService.getErrorStats.bind(errorTrackingService),
    clearErrors: errorTrackingService.clearErrors.bind(errorTrackingService)
  };
};
