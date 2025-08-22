import type { AffiliateApplication } from './types';

interface ApiResponse {
  ok: boolean;
  message?: string;
  data?: any;
}

export const postApplication = async (data: AffiliateApplication): Promise<ApiResponse> => {
  try {
    const response = await fetch('http://localhost:3001/api/affiliates/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: result.error || `HTTP error! status: ${response.status}`
      };
    }

    return {
      ok: true,
      message: result.message || 'Application submitted successfully',
      data: result.affiliate
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Network error. Please try again.'
    };
  }
};
