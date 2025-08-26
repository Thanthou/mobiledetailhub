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

export interface ApiResponse {
  success: boolean;
  message?: string;
  users?: any[];
  applications?: any[];
  count?: number;
}

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
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
    return this.makeRequest('/api/quote', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkHealth(): Promise<ApiResponse> {
    return this.makeRequest('/api/health');
  }

  async login(email: string, password: string): Promise<ApiResponse> {
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
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async getUsers(status?: string): Promise<ApiResponse> {
    const endpoint = status && status !== 'all-users' 
      ? `/api/admin/users?status=${status}`
      : '/api/admin/users';
    
    const url = `${config.apiUrls.local}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
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

  async getPendingApplications(): Promise<ApiResponse> {
    const url = `${config.apiUrls.local}/api/admin/pending-applications`;
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
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

  async approveApplication(applicationId: number, approvedSlug: string, adminNotes: string): Promise<ApiResponse> {
    const url = `${config.apiUrls.local}/api/admin/approve-application/${applicationId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
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

  async rejectApplication(applicationId: number, rejectionReason: string, adminNotes: string): Promise<ApiResponse> {
    const url = `${config.apiUrls.local}/api/admin/reject-application/${applicationId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
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

  async deleteAffiliate(affiliateId: number): Promise<ApiResponse> {
    const url = `${config.apiUrls.local}/api/admin/affiliates/${affiliateId}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
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