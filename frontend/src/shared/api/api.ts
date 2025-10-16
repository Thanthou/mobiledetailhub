// import { config } from '@/../config/env';

// Extend Error interface for custom error codes
interface CustomError extends Error {
  code?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: number;
}

// API error response interface
interface ApiErrorResponse {
  message?: string;
  error?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: number;
}

// Generic API response interface for unknown responses
interface UnknownApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
  [key: string]: unknown;
}

const API_BASE_URL = ''; // Always use relative URLs to leverage Vite proxy

export interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  vehicle: string;
  services: string[];
  additionalInfo?: string;
  preferredDate?: string;
}

// User interface for admin operations
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'affiliate' | 'customer' | 'tenant';
  is_admin?: boolean;
  created_at: string;
  business_name?: string;
  application_status?: string;
  slug?: string;
}

// Affiliate application interface
export interface AffiliateApplication {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
  phone: string;
  email: string;
  has_insurance: boolean;
  source: string;
  notes?: string;
  application_date: string;
  created_at: string;
  city?: string;
  state_code?: string;
  postal_code?: string;
}

// Generic API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Specific response interfaces
export interface UsersResponse extends ApiResponse {
  users: User[];
  count: number;
}

export interface ApplicationsResponse extends ApiResponse {
  applications: AffiliateApplication[];
  count: number;
}

export interface LoginResponse extends ApiResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
    phone?: string;
    is_admin?: boolean;
  };
}

export interface AffiliateApprovalResponse extends ApiResponse {
  affiliate: AffiliateApplication & {
    user_id: number;
    temp_password: string;
  };
  note: string;
}

export interface AffiliateRejectionResponse extends ApiResponse {
  affiliate: AffiliateApplication;
}

export interface AffiliateDeletionResponse extends ApiResponse {
  deletedAffiliate?: {
    id: number;
    business_name: string;
    slug: string;
    email: string;
  };
  deletedUser?: {
    id: number;
    name: string;
    email: string;
  };
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json() as UnknownApiResponse;
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Network response was not ok';
        throw new Error(errorMessage);
      }
      
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async submitQuoteRequest(data: QuoteFormData): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/quote', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkHealth(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/health');
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Use relative URL to leverage Vite proxy
    const url = '/api/auth/login';
    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => { controller.abort(); }, 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json() as ApiErrorResponse & LoginResponse;
      
      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          const error: CustomError = new Error(data.error || 'Rate limited');
          error.code = 'RATE_LIMITED';
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        
        // Handle other error codes
        if (response.status === 401) {
          const error: CustomError = new Error(data.error || 'Invalid credentials');
          error.code = 'INVALID_CREDENTIALS';
          throw error;
        }
        
        if (response.status === 403) {
          const error: CustomError = new Error(data.error || 'Access denied');
          error.code = 'FORBIDDEN';
          throw error;
        }
        
        const errorMessage = data.message || data.error || 'Login failed';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      
      // Handle timeout specifically
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError: CustomError = new Error('Login request timed out. Please check your connection and try again.');
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: CustomError = new Error('Network error. Please check your connection and try again.');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      
      // Re-throw with additional context if it's not already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(email: string, password: string, name: string, phone?: string): Promise<LoginResponse> {
    // Use relative URL to leverage Vite proxy
    const url = '/api/auth/register';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });
      
      const data = await response.json() as ApiErrorResponse & LoginResponse;
      
      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          const error: CustomError = new Error(data.error || 'Rate limited');
          error.code = 'RATE_LIMITED';
          error.retryAfterSeconds = data.retryAfterSeconds;
          error.remainingAttempts = data.remainingAttempts;
          error.resetTime = data.resetTime;
          throw error;
        }
        
        // Handle other error codes
        if (response.status === 400) {
          const errorMessage = data.message || data.error || 'Registration failed';
          const error: CustomError = new Error(errorMessage);
          error.code = 'VALIDATION_ERROR';
          throw error;
        }
        
        const errorMessage = data.message || data.error || 'Registration failed';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      console.error('Registration failed:', error);
      // Re-throw with additional context if it's not already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  async getUsers(status?: string): Promise<UsersResponse> {
    const endpoint = status && status !== 'all-users' 
      ? `/api/admin/users?status=${status}`
      : '/api/admin/users';
    
    // Get token from localStorage (optional in development mode)
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.makeRequest<UsersResponse>(endpoint, {
      headers,
    });
  }

  async getPendingApplications(): Promise<ApplicationsResponse> {
    // Use relative URL to leverage Vite proxy
    const url = '/api/admin/pending-applications';
    
    // Get token from localStorage (optional in development mode)
    const token = localStorage.getItem('token');
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        headers,
      });
      
      const data = await response.json() as ApplicationsResponse;
      
      if (!response.ok) {
        const errorMessage = data.message || 'Network response was not ok';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async approveApplication(applicationId: number, approvedSlug: string, adminNotes: string, serviceAreas?: Array<{city: string, state: string, zip?: string}>): Promise<AffiliateApprovalResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/approve-application/${applicationId.toString()}`;
    
    // Get token from localStorage (optional in development mode)
    const token = localStorage.getItem('token');
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          approved_slug: approvedSlug,
          admin_notes: adminNotes,
          ...(serviceAreas && serviceAreas.length > 0 && { service_areas: serviceAreas })
        }),
      });
      
      const data = await response.json() as AffiliateApprovalResponse;
      
      if (!response.ok) {
        const errorMessage = data.message || 'Network response was not ok';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async rejectApplication(applicationId: number, rejectionReason: string, adminNotes: string): Promise<AffiliateRejectionResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/reject-application/${applicationId.toString()}`;
    
    // Get token from localStorage (optional in development mode)
    const token = localStorage.getItem('token');
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rejection_reason: rejectionReason,
          admin_notes: adminNotes
        }),
      });
      
      const data = await response.json() as AffiliateRejectionResponse;
      
      if (!response.ok) {
        const errorMessage = data.message || 'Network response was not ok';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async deleteAffiliate(affiliateId: number): Promise<AffiliateDeletionResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/tenants/${affiliateId.toString()}`;
    
    // Get token from localStorage (optional in development mode)
    const token = localStorage.getItem('token');
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      
      const data = await response.json() as AffiliateDeletionResponse;
      
      if (!response.ok) {
        const errorMessage = data.message || 'Network response was not ok';
        throw new Error(errorMessage);
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }
}

export const apiService = new ApiService(); 