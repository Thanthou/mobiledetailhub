// API functions for locations management

interface ServiceAreaData {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

export const saveLocationData = async (tenantSlug: string, locationData: ServiceAreaData[]) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceAreas: locationData }),
  });

  if (!response.ok) {
    const error = await response.json() as ApiResponse;
    throw new Error(error.error || 'Failed to save location data');
  }

  return response.json() as Promise<ApiResponse>;
};

export const saveServiceAreas = async (tenantSlug: string, serviceAreas: ServiceAreaData[]) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceAreas }),
  });

  if (!response.ok) {
    const error = await response.json() as ApiResponse;
    throw new Error(error.error || 'Failed to save service areas');
  }

  return response.json() as Promise<ApiResponse>;
};

export const addServiceArea = async (tenantSlug: string, areaData: ServiceAreaData) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(areaData),
  });

  if (!response.ok) {
    const error = await response.json() as ApiResponse;
    throw new Error(error.error || 'Failed to add service area');
  }

  return response.json() as Promise<ApiResponse>;
};

export const deleteServiceArea = async (tenantSlug: string, areaId: string) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}/${areaId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json() as ApiResponse;
    throw new Error(error.error || 'Failed to delete service area');
  }

  return response.json() as Promise<ApiResponse>;
};
