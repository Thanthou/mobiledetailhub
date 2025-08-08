const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}

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
  message: string;
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

  async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
    return this.makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitQuoteRequest(data: QuoteFormData): Promise<ApiResponse> {
    return this.makeRequest('/quote', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkHealth(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService(); 