import { config } from '@shared/env';

import type { AffiliateApplication } from '../types';

interface ApiResponse {
  ok: boolean;
  message?: string;
  data?: unknown;
}

interface AffiliateApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  affiliate?: AffiliateApplication;
}

export const postApplication = async (data: AffiliateApplication): Promise<ApiResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => { controller.abort(); }, 30000); // 30 second timeout
    
    const response = await fetch(`${config.apiUrl || ''}/api/affiliates/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const result = await response.json() as AffiliateApiResponse;

    if (!response.ok) {
      return {
        ok: false,
        message: result.error || `HTTP error! status: ${response.status.toString()}`
      };
    }

    return {
      ok: true,
      message: result.message || 'Application submitted successfully',
      data: result.affiliate
    };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          message: 'Request timed out. Please check if the backend server is running and try again.'
        };
      }
      return {
        ok: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
    
    return {
      ok: false,
      message: 'Network error. Please try again.'
    };
  }
};
