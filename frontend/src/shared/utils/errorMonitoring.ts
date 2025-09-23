/**
 * Enhanced Error Monitoring System
 * Catches all frontend errors including console errors, unhandled promises, and React errors
 */

interface ErrorEvent {
  id: string;
  timestamp: Date;
  type: 'console' | 'unhandled' | 'promise' | 'react' | 'network';
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
  errorBoundary?: string;
  networkInfo?: {
    url: string;
    method: string;
    status?: number;
    responseTime?: number;
  };
}

class ErrorMonitor {
  private errors: ErrorEvent[] = [];
  private maxErrors = 1000; // Keep last 1000 errors
  private sessionId: string;
  private userId?: string;
  private isEnabled = false; // Disabled to see actual console errors
  private listeners: ((error: ErrorEvent) => void)[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupConsoleErrorHandling();
    this.setupNetworkErrorHandling();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Catch all unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'unhandled',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
      });
    });

    // Catch resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError({
          type: 'network',
          message: `Resource loading error: ${event.target}`,
          networkInfo: {
            url: (event.target as any)?.src || (event.target as any)?.href || 'unknown',
            method: 'GET',
          },
        });
      }
    }, true);
  }

  private setupConsoleErrorHandling(): void {
    // Override console methods to catch all console errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: any[]) => {
      this.captureError({
        type: 'console',
        message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
        stack: new Error().stack,
      });
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      this.captureError({
        type: 'console',
        message: `WARNING: ${args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')}`,
        stack: new Error().stack,
      });
      originalConsoleWarn.apply(console, args);
    };
  }

  private setupNetworkErrorHandling(): void {
    // Override fetch to catch network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';

      try {
        const response = await originalFetch(...args);
        const responseTime = Date.now() - startTime;

        // Log failed requests
        if (!response.ok) {
          this.captureError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            networkInfo: {
              url,
              method,
              status: response.status,
              responseTime,
            },
          });
        }

        return response;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        this.captureError({
          type: 'network',
          message: `Network error: ${error instanceof Error ? error.message : String(error)}`,
          networkInfo: {
            url,
            method,
            responseTime,
          },
        });
        throw error;
      }
    };
  }

  private captureError(errorData: Partial<ErrorEvent>): void {
    if (!this.isEnabled) return;

    const error: ErrorEvent = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: 'console',
      message: '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userId: this.userId,
      ...errorData,
    };

    this.errors.push(error);

    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(error));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Captured (${error.type.toUpperCase()})`);
      console.error('Message:', error.message);
      console.error('Timestamp:', error.timestamp.toISOString());
      console.error('URL:', error.url);
      if (error.stack) console.error('Stack:', error.stack);
      if (error.componentStack) console.error('Component Stack:', error.componentStack);
      if (error.networkInfo) console.error('Network Info:', error.networkInfo);
      console.groupEnd();
    }
  }

  // Public methods
  public captureReactError(error: Error, errorInfo: any, componentStack?: string): void {
    this.captureError({
      type: 'react',
      message: error.message,
      stack: error.stack,
      componentStack: componentStack || errorInfo?.componentStack,
    });
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  public getErrorsByType(type: ErrorEvent['type']): ErrorEvent[] {
    return this.errors.filter(error => error.type === type);
  }

  public getRecentErrors(count: number = 10): ErrorEvent[] {
    return this.errors.slice(-count);
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public addListener(listener: (error: ErrorEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public exportErrors(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      errors: this.errors,
    }, null, 2);
  }

  public printErrorsToConsole(): void {
    console.group('🔍 Error Monitor - All Captured Errors');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Total Errors: ${this.errors.length}`);
    console.log(`User ID: ${this.userId || 'Not set'}`);
    
    this.errors.forEach((error, index) => {
      console.group(`Error ${index + 1} (${error.type})`);
      console.log('Time:', error.timestamp.toISOString());
      console.log('Message:', error.message);
      console.log('URL:', error.url);
      if (error.stack) console.log('Stack:', error.stack);
      if (error.componentStack) console.log('Component Stack:', error.componentStack);
      if (error.networkInfo) console.log('Network Info:', error.networkInfo);
      console.groupEnd();
    });
    
    console.groupEnd();
  }

  public getErrorSummary(): {
    total: number;
    byType: Record<string, number>;
    recent: ErrorEvent[];
  } {
    const byType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errors.length,
      byType,
      recent: this.getRecentErrors(5),
    };
  }
}

// Create singleton instance
export const errorMonitor = new ErrorMonitor();

// Export types for use in other files
export type { ErrorEvent };

// Global error handler for React errors
export const handleReactError = (error: Error, errorInfo: any, componentStack?: string) => {
  errorMonitor.captureReactError(error, errorInfo, componentStack);
};

// Console commands for debugging
if (typeof window !== 'undefined') {
  (window as any).errorMonitor = errorMonitor;
  (window as any).printErrors = () => errorMonitor.printErrorsToConsole();
  (window as any).getErrors = () => errorMonitor.getErrors();
  (window as any).clearErrors = () => errorMonitor.clearErrors();
  (window as any).exportErrors = () => errorMonitor.exportErrors();
}
