/**
 * API client for tenant dashboard reviews
 */

export interface TenantReviewData {
  customer_name: string;
  rating: number;
  comment: string;
  reviewer_url?: string;
  vehicle_type?: 'car' | 'truck' | 'suv' | 'boat' | 'rv' | 'motorcycle';
  paint_correction?: boolean;
  ceramic_coating?: boolean;
  paint_protection_film?: boolean;
  source?: 'website' | 'google' | 'yelp' | 'facebook';
  avatar_filename?: string;
}

export interface TenantReview {
  id: number;
  tenant_slug: string;
  customer_name: string;
  rating: number;
  comment: string;
  reviewer_url?: string;
  vehicle_type?: string;
  paint_correction: boolean;
  ceramic_coating: boolean;
  paint_protection_film: boolean;
  source: string;
  avatar_filename?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  data: TenantReview;
  message: string;
}

export interface GetReviewsResponse {
  success: boolean;
  data: TenantReview[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface BusinessData {
  id: number;
  slug: string;
  business_name: string;
  application_status: string;
  phone: string;
  sms_phone: string;
  twilio_phone: string;
  service_areas: any;
  owner: string;
  business_email: string;
  personal_email: string;
  first_name: string;
  last_name: string;
  personal_phone: string;
  business_start_date: string;
  website: string;
  gbp_url: string;
  google_maps_url: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;
  created_at: string;
  updated_at: string;
}

export interface GetBusinessResponse {
  success: boolean;
  data: BusinessData;
}

/**
 * Create a new review
 * Note: No authentication required - reviews are public submissions
 */
export const createReview = async (
  tenantSlug: string,
  reviewData: TenantReviewData
): Promise<CreateReviewResponse> => {
  const response = await fetch('/api/tenant-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tenant_slug: tenantSlug,
      ...reviewData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: number): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`/api/tenant-reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Upload avatar for a review
 */
export const uploadAvatar = async (
  avatarFile: File,
  customerName: string,
  reviewId: number
): Promise<{ success: boolean; message: string; avatarUrl?: string; filename?: string }> => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  formData.append('customerName', customerName);
  formData.append('reviewId', reviewId.toString());

  const response = await fetch('/api/tenant-reviews/upload-avatar', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get reviews for a specific tenant (public endpoint)
 */
export const getReviews = async (
  tenantSlug: string,
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<GetReviewsResponse> => {
  const params = new URLSearchParams();
  
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());

  const response = await fetch(`/api/tenant-reviews/${tenantSlug}?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get reviews for a specific tenant (authenticated endpoint)
 */
export const getTenantReviews = async (
  tenantSlug: string,
  options: {
    status?: 'pending' | 'approved' | 'rejected';
    limit?: number;
    offset?: number;
  } = {}
): Promise<GetReviewsResponse> => {
  const params = new URLSearchParams();
  
  if (options.status) params.append('status', options.status);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());

  const response = await fetch(`/api/tenant-reviews/${tenantSlug}?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get business data for a specific tenant (including GBP URL)
 */
export const getBusinessData = async (tenantSlug: string): Promise<GetBusinessResponse> => {
  const response = await fetch(`/api/tenants/${tenantSlug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Scrape Google Business Profile or Google Maps for rating and review count
 */
export const scrapeGoogleBusinessProfile = async (
  url: string,
  tenantSlug?: string
): Promise<{
  success: boolean;
  data?: {
    averageRating: string | null;
    totalReviews: string | null;
    businessName: string | null;
    gbpUrl: string;
  };
  message: string;
}> => {
  const response = await fetch('/api/tenant-reviews/scrape-google-business', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gbpUrl: url, // Backend still expects gbpUrl parameter name
      tenantSlug,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Update review status (admin/tenant only)
 */
export const updateReviewStatus = async (
  reviewId: number,
  status: 'pending' | 'approved' | 'rejected'
): Promise<{ success: boolean; data: TenantReview; message: string }> => {
  const response = await fetch(`/api/tenant-reviews/${reviewId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
