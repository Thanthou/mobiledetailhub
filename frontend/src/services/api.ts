import { config } from '../config/environment';

// Extend Error interface for custom error codes
interface CustomError extends Error {
  code?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: number;
}

const API_BASE_URL = config.apiUrl;

export interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  vehicle: string;
  service: string;
  additionalInfo?: string;
  preferredDate?: string;
}

// User interface for admin operations
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'affiliate' | 'customer';
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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
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
        
        throw new Error(data.message || data.error || 'Login failed');
      }
      
      return data;
      
    } catch (error) {
      console.error('Login failed:', error);
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
      
      const data = await response.json();
      
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
          const error: CustomError = new Error(data.message || data.error || 'Registration failed');
          error.code = 'VALIDATION_ERROR';
          throw error;
        }
        
        throw new Error(data.message || data.error || 'Registration failed');
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
    
    // Use relative URL to leverage Vite proxy
    const url = endpoint;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token required');
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async getPendingApplications(): Promise<ApplicationsResponse> {
    // Use relative URL to leverage Vite proxy
    const url = '/api/admin/pending-applications';
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token required');
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async approveApplication(applicationId: number, approvedSlug: string, adminNotes: string): Promise<AffiliateApprovalResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/approve-application/${applicationId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token required');
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          approved_slug: approvedSlug,
          admin_notes: adminNotes
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async rejectApplication(applicationId: number, rejectionReason: string, adminNotes: string): Promise<AffiliateRejectionResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/reject-application/${applicationId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token required');
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason,
          admin_notes: adminNotes
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  async deleteAffiliate(affiliateId: number): Promise<AffiliateDeletionResponse> {
    // Use relative URL to leverage Vite proxy
    const url = `/api/admin/affiliates/${affiliateId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token required');
    }
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      
      return data;
      
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
  }
}

export const apiService = new ApiService(); 