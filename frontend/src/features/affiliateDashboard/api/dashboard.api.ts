// Affiliate Dashboard API calls
import type { 
  Appointment, 
  Customer, 
  DashboardMetrics, 
  DetailerData, 
  ProfileUpdate, 
  Service, 
  ServiceArea} from '../types';

export const dashboardApi = {
  // Get affiliate data by business slug
  getAffiliateData: async (businessSlug: string): Promise<DetailerData> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch affiliate data');
    }
    
    return response.json() as Promise<DetailerData>;
  },

  // Get dashboard metrics
  getDashboardMetrics: async (businessSlug: string): Promise<DashboardMetrics> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/metrics`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard metrics');
    }
    
    return response.json() as Promise<DashboardMetrics>;
  },

  // Get appointments
  getAppointments: async (businessSlug: string, dateRange?: { start: string; end: string }): Promise<Appointment[]> => {
    const token = localStorage.getItem('token');
    const url = new URL(`/api/affiliates/${businessSlug}/appointments`, window.location.origin);
    
    if (dateRange) {
      url.searchParams.set('start', dateRange.start);
      url.searchParams.set('end', dateRange.end);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    return response.json() as Promise<Appointment[]>;
  },

  // Get customers
  getCustomers: async (businessSlug: string): Promise<Customer[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/customers`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    
    return response.json() as Promise<Customer[]>;
  },

  // Get services
  getServices: async (businessSlug: string): Promise<Service[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/services`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    return response.json() as Promise<Service[]>;
  },

  // Update affiliate profile
  updateProfile: async (businessSlug: string, data: ProfileUpdate): Promise<DetailerData> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json() as Promise<DetailerData>;
  },

  // Add service area
  addServiceArea: async (businessSlug: string, area: Omit<ServiceArea, 'id'>): Promise<ServiceArea> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/service-areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      },
      body: JSON.stringify(area)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add service area');
    }
    
    return response.json() as Promise<ServiceArea>;
  },

  // Remove service area
  removeServiceArea: async (businessSlug: string, areaId: string): Promise<{ success: boolean }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/affiliates/${businessSlug}/service-areas/${areaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove service area');
    }
    
    return response.json() as Promise<{ success: boolean }>;
  }
};
