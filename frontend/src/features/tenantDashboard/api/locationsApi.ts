// API functions for locations management
export const saveLocationData = async (tenantSlug: string, locationData: any) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceAreas: locationData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save location data');
  }

  return response.json();
};

export const saveServiceAreas = async (tenantSlug: string, serviceAreas: any) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceAreas }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save service areas');
  }

  return response.json();
};

export const addServiceArea = async (tenantSlug: string, areaData: any) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(areaData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add service area');
  }

  return response.json();
};

export const deleteServiceArea = async (tenantSlug: string, areaId: string) => {
  const response = await fetch(`/api/locations/service-areas/${tenantSlug}/${areaId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete service area');
  }

  return response.json();
};
