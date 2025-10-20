/**
 * Enhanced Error Monitoring System
 * Catches all frontend errors including console errors, unhandled promises, and React errors
 */

interface ReactErrorInfo {
  componentStack?: string;
}

// Type guard to safely extract error properties
function getErrorStack(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'stack' in error) {
    return String((error as { stack: unknown }).stack);
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

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
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Catch all unhandled errors
    window.addEventListener('error', (event) => {
      const stack = getErrorStack(event.error);
      this.captureError({
        type: 'unhandled',
        message: event.message,
        ...(stack ? { stack } : {}),
        url: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const stack = getErrorStack(event.reason);
      this.captureError({
        type: 'promise',
        message: getErrorMessage(event.reason),
        ...(stack ? { stack } : {}),
      });
    });

    // Catch resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target;
        const targetName = target instanceof Element ? target.tagName.toLowerCase() : 'unknown';
        
        let url = 'unknown';
        if (target && typeof target === 'object') {
          if ('src' in target && typeof target.src === 'string') {
            url = target.src;
          } else if ('href' in target && typeof target.href === 'string') {
            url = target.href;
          }
        }
        
        this.captureError({
          type: 'network',
          message: `Resource loading error: ${targetName}`,
          networkInfo: {
            url,
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

    console.error = (...args: unknown[]) => {
      const stack = new Error().stack;
      this.captureError({
        type: 'console',
        message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
        ...(stack ? { stack } : {}),
      });
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      // Suppress Stripe's HTTP warning in development
      const firstArg = args[0];
      if (typeof firstArg === 'string' && firstArg.includes('Stripe.js integration over HTTP')) {
        return;
      }
      
      const stack = new Error().stack;
      this.captureError({
        type: 'console',
        message: `WARNING: ${args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')}`,
        ...(stack ? { stack } : {}),
      });
      originalConsoleWarn.apply(console, args);
    };
  }

  private setupNetworkErrorHandling(): void {
    // Override fetch to catch network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const startTime = Date.now();
      const requestInput = args[0];
      // Extract URL from request input - either string or Request object
      let url: string;
      if (typeof requestInput === 'string') {
        url = requestInput;
      } else {
        url = (requestInput as Request).url;
      }
      const method = args[1]?.method || 'GET';
      const headers = (args[1]?.headers || {}) as Record<string, string>;
      const isErrorReporting =
        url.includes('/api/errors/track') ||
        Object.entries(headers).some(([k, v]) => k.toLowerCase() === 'x-error-reporting' && String(v).toLowerCase() === 'true');

      try {
        const response = await originalFetch(...args);
        const responseTime = Date.now() - startTime;

        // Log failed requests (but ignore localhost connection refused errors)
        if (!response.ok && !(url.includes('localhost:5173') && response.status === 0)) {
          if (isErrorReporting) {
            return response;
          }
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
      } catch (error: unknown) {
        const responseTime = Date.now() - startTime;
        const errorMessage = getErrorMessage(error);
        
        // Check if it's a connection refused error to localhost
        const isLocalConnectionError = 
          url.includes('localhost:5173') && 
          error instanceof TypeError && 
          errorMessage.includes('ERR_CONNECTION_REFUSED');
        
        // Don't log connection refused errors to localhost:5173 (Vite dev server pings)
        if (!isLocalConnectionError && !isErrorReporting) {
          this.captureError({
            type: 'network',
            message: `Network error: ${errorMessage}`,
            networkInfo: {
              url,
              method,
              responseTime,
            },
          });
        }
        
        throw error;
      }
    };
  }

  private captureError(errorData: Partial<ErrorEvent>): void {
    if (!this.isEnabled) return;

    const error: ErrorEvent = {
      id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date(),
      type: 'console',
      message: '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      ...(this.userId ? { userId: this.userId } : {}),
      ...errorData,
    };

    this.errors.push(error);

    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Notify listeners
    this.listeners.forEach(listener => { listener(error); });

    // Log to console in development
    if (import.meta.env.DEV) {
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
  public captureReactError(error: Error, errorInfo: ReactErrorInfo, componentStack?: string): void {
    const stack = error.stack;
    const component = componentStack || errorInfo.componentStack;
    this.captureError({
      type: 'react',
      message: error.message,
      ...(stack ? { stack } : {}),
      ...(component ? { componentStack: component } : {}),
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
    const byType = this.errors.reduce<Record<string, number>>((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});

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
export type { ErrorEvent, ReactErrorInfo };

// Global error handler for React errors
export const handleReactError = (error: Error, errorInfo: ReactErrorInfo, componentStack?: string) => {
  errorMonitor.captureReactError(error, errorInfo, componentStack);
};

// Extend Window interface for debugging commands
declare global {
  interface Window {
    errorMonitor: ErrorMonitor;
    printErrors: () => void;
    getErrors: () => ErrorEvent[];
    clearErrors: () => void;
    exportErrors: () => string;
  }
}

// Console commands for debugging
if (typeof window !== 'undefined') {
  window.errorMonitor = errorMonitor;
  window.printErrors = () => { errorMonitor.printErrorsToConsole(); };
  window.getErrors = () => errorMonitor.getErrors();
  window.clearErrors = () => { errorMonitor.clearErrors(); };
  window.exportErrors = () => errorMonitor.exportErrors();
}
