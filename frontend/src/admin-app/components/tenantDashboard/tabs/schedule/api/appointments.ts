import { config } from '@/shared/env';

import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../types';

const API_BASE = `${config.apiUrl || ''}/api/schedule`;

// Generic API request function
async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => { 
      controller.abort(); 
    }, 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' })) as { error?: string };
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    console.error('API request failed:', error);
    throw error;
  }
}

// Get appointments for a specific date range
export const getAppointments = async (
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  const params = new URLSearchParams({ startDate, endDate });
  return makeRequest<Appointment[]>(`/appointments?${params}`);
};

// Get appointments for a specific date
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  return makeRequest<Appointment[]>(`/appointments/date/${date}`);
};

// Get a single appointment by ID
export const getAppointment = async (id: number): Promise<Appointment> => {
  return makeRequest<Appointment>(`/appointments/${id}`);
};

// Create a new appointment
export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<Appointment> => {
  return makeRequest<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update an existing appointment
export const updateAppointment = async (
  id: number,
  data: UpdateAppointmentRequest
): Promise<Appointment> => {
  return makeRequest<Appointment>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<void> => {
  await makeRequest<{ message?: string }>(`/appointments/${id}`, {
    method: 'DELETE',
  });
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: number,
  status: string
): Promise<Appointment> => {
  return makeRequest<Appointment>(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (
  date: string,
  duration: number = 60
): Promise<string[]> => {
  const params = new URLSearchParams({ date, duration: duration.toString() });
  return makeRequest<string[]>(`/appointments/available-slots?${params}`);
};
