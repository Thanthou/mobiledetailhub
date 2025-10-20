// Affiliate onboarding API calls
import type { 
  AffiliateApplication, 
  DraftApplication
} from '@shared/schemas/onboarding.schemas';

// API Response types
interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

// Helper function to handle API responses safely
async function handleApiResponse<T>(response: Response): Promise<T> {
  const responseData = await response.json() as ApiErrorResponse | ApiSuccessResponse<T>;
  
  if (!response.ok) {
    const errorData = responseData as ApiErrorResponse;
    throw new Error(errorData.message || 'An error occurred');
  }
  
  const successData = responseData as ApiSuccessResponse<T>;
  return successData.data;
}

export const onboardingApi = {
  // Submit affiliate application
  submitApplication: async (applicationData: AffiliateApplication): Promise<{ id: string; status: string }> => {
    const response = await fetch('/api/affiliates/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    return handleApiResponse<{ id: string; status: string }>(response);
  },

  // Save draft application
  saveDraft: async (applicationData: Partial<AffiliateApplication>): Promise<{ success: boolean }> => {
    const response = await fetch('/api/affiliates/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    return handleApiResponse<{ success: boolean }>(response);
  },

  // Load draft application
  loadDraft: async (userId?: string): Promise<DraftApplication | null> => {
    const url = userId ? `/api/affiliates/draft?user_id=${userId}` : '/api/affiliates/draft';
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No draft found
      }
      // Handle other errors by throwing
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.message || 'An error occurred');
    }

    return handleApiResponse<DraftApplication>(response);
  },

  // Delete draft application
  deleteDraft: async (userId?: string): Promise<{ success: boolean }> => {
    const url = userId ? `/api/affiliates/draft?user_id=${userId}` : '/api/affiliates/draft';
    const response = await fetch(url, {
      method: 'DELETE',
    });

    return handleApiResponse<{ success: boolean }>(response);
  },

  // Upload files for proof of work
  uploadFiles: async (files: File[], applicationId?: string) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index.toString()}`, file);
    });
    
    if (applicationId) {
      formData.append('application_id', applicationId);
    }

    const response = await fetch('/api/affiliates/upload', {
      method: 'POST',
      body: formData,
    });

    return handleApiResponse<{ success: boolean }>(response);
  },

  // Get application status
  getApplicationStatus: async (applicationId: string) => {
    const response = await fetch(`/api/affiliates/status/${applicationId}`);

    return handleApiResponse<{ status: string }>(response);
  },

  // Update application
  updateApplication: async (applicationId: string, updates: Partial<AffiliateApplication>) => {
    const response = await fetch(`/api/affiliates/application/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return handleApiResponse<AffiliateApplication>(response);
  },

  // Get application by ID
  getApplication: async (applicationId: string) => {
    const response = await fetch(`/api/affiliates/application/${applicationId}`);

    return handleApiResponse<AffiliateApplication>(response);
  },

  // Validate business name availability
  validateBusinessName: async (businessName: string) => {
    const response = await fetch(`/api/affiliates/validate-business-name?name=${encodeURIComponent(businessName)}`);

    return handleApiResponse<{ isAvailable: boolean; suggestions?: string[] }>(response);
  },

  // Get service areas for location
  getServiceAreas: async (location: { city: string; state: string; zipCode: string }) => {
    const response = await fetch('/api/affiliates/service-areas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    return handleApiResponse<{ areas: Array<{ name: string; coordinates: { lat: number; lng: number }; radius: number }> }>(response);
  }
};
