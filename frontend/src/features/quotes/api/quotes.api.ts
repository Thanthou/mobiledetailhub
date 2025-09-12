// Quote-specific API calls
import { apiService } from '@/shared/api/api';

export const quotesApi = {
  // Submit a quote request
  submitQuoteRequest: async (quoteData: {
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    services: string[];
    message: string;
    location: string;
    businessSlug?: string;
  }) => {
    return await apiService.submitQuoteRequest(quoteData);
  },

  // Get quote by ID
  getQuote: async (quoteId: string) => {
    const response = await fetch(`/api/quotes/${quoteId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }
    return await response.json() as unknown;
  },

  // Update quote status
  updateQuoteStatus: async (quoteId: string, status: string) => {
    const response = await fetch(`/api/quotes/${quoteId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update quote status: ${response.statusText}`);
    }
    return await response.json() as unknown;
  },

  // Get quotes for a business
  getBusinessQuotes: async (businessSlug: string, limit = 10, offset = 0) => {
    const response = await fetch(`/api/quotes?business_slug=${businessSlug}&limit=${String(limit)}&offset=${String(offset)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch business quotes: ${response.statusText}`);
    }
    return await response.json() as unknown;
  },

  // Get user quotes
  getUserQuotes: async (userId: string, limit = 10, offset = 0) => {
    const response = await fetch(`/api/quotes?user_id=${userId}&limit=${String(limit)}&offset=${String(offset)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user quotes: ${response.statusText}`);
    }
    return await response.json() as unknown;
  },

  // Cancel quote
  cancelQuote: async (quoteId: string, reason?: string) => {
    const response = await fetch(`/api/quotes/${quoteId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel quote: ${response.statusText}`);
    }
    return await response.json() as unknown;
  }
};
