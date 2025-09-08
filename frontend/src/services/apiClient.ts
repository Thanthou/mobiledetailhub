import { config } from '../config/environment';

// Types for the API client
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RefreshResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: unknown;
}

interface ErrorResponse {
  error?: string;
  message?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: number;
}

// Extend Error interface for custom error codes
interface CustomError extends Error {
  code?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: number;
}

// One-flight guard for refresh token requests
class RefreshTokenGuard {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  async executeRefresh(): Promise<string> {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${config.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data = await response.json() as RefreshResponse;
      
      // Update tokens in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Process queued requests
      this.processQueue(null, data.accessToken);
      
      return data.accessToken;
    } catch (error: unknown) {
      // Process queued requests with error
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }
}

// API Client with token refresh interceptor
class ApiClient {
  private refreshGuard = new RefreshTokenGuard();
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Main request method with automatic token refresh
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add auth header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, options);
      
      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && localStorage.getItem('refreshToken')) {
        try {
          const newToken = await this.refreshGuard.executeRefresh();
          
          // Retry the original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };
          
          const retryResponse = await fetch(url, retryOptions);
          
          if (!retryResponse.ok) {
            throw new Error(`Request failed: ${retryResponse.status.toString()}`);
          }
          
          return await retryResponse.json() as T;
        } catch {
          // Refresh failed, clear auth state and redirect
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as ErrorResponse;
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const error: CustomError = new Error(errorData.error ?? 'Rate limited');
          error.code = 'RATE_LIMITED';
          error.retryAfterSeconds = errorData.retryAfterSeconds;
          error.remainingAttempts = errorData.remainingAttempts;
          error.resetTime = errorData.resetTime;
          throw error;
        }
        
        // Handle other error codes
        if (response.status === 401) {
          const error: CustomError = new Error(errorData.error ?? 'Unauthorized');
          error.code = 'UNAUTHORIZED';
          throw error;
        }
        
        if (response.status === 403) {
          const error: CustomError = new Error(errorData.error ?? 'Forbidden');
          error.code = 'FORBIDDEN';
          throw error;
        }
        
        throw new Error(errorData.error ?? errorData.message ?? `Request failed: ${response.status.toString()}`);
      }
      
      return await response.json() as T;
    } catch (error: unknown) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Handle authentication failure
  private handleAuthFailure() {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login or home page
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Upload file
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type for FormData, let browser set it with boundary
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(config.apiUrl);

// Export the client class for testing or custom instances
export { ApiClient };

// Export types
export type { ApiResponse, RefreshResponse };
