import { config } from '../config/environment';

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
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
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
    const url = `${config.apiUrls.local}/api/auth/login`;
    
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
        throw new Error(data.error || 'Login failed');
      }
      
      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async getUsers(status?: string): Promise<UsersResponse> {
    const endpoint = status && status !== 'all-users' 
      ? `/api/admin/users?status=${status}`
      : '/api/admin/users';
    
    const url = `${config.apiUrls.local}${endpoint}`;
    
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
    const url = `${config.apiUrls.local}/api/admin/pending-applications`;
    
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
    const url = `${config.apiUrls.local}/api/admin/approve-application/${applicationId}`;
    
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
    const url = `${config.apiUrls.local}/api/admin/reject-application/${applicationId}`;
    
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
    const url = `${config.apiUrls.local}/api/admin/affiliates/${affiliateId}`;
    
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