import { config } from '@shared/env';

import type {
  ScheduleSettings,
  UpdateScheduleSettingsRequest,
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

// Get schedule settings for the current affiliate
export const getScheduleSettings = async (): Promise<ScheduleSettings> => {
  return makeRequest<ScheduleSettings>('/settings');
};

// Update schedule settings
export const updateScheduleSettings = async (
  data: UpdateScheduleSettingsRequest
): Promise<ScheduleSettings> => {
  return makeRequest<ScheduleSettings>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Reset schedule settings to defaults
export const resetScheduleSettings = async (): Promise<ScheduleSettings> => {
  return makeRequest<ScheduleSettings>('/settings/reset', {
    method: 'POST',
  });
};
