import type {
  TimeBlock,
  CreateTimeBlockRequest,
  UpdateTimeBlockRequest,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3001';
const API_BASE = `${API_BASE_URL}/api/schedule`;

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
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
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

// Get time blocks for a specific date range
export const getTimeBlocks = async (
  startDate: string,
  endDate: string
): Promise<TimeBlock[]> => {
  const params = new URLSearchParams({ startDate, endDate });
  return makeRequest<TimeBlock[]>(`/time-blocks?${params}`);
};

// Get time blocks for a specific date
export const getTimeBlocksByDate = async (date: string): Promise<TimeBlock[]> => {
  return makeRequest<TimeBlock[]>(`/time-blocks/date/${date}`);
};

// Get a single time block by ID
export const getTimeBlock = async (id: number): Promise<TimeBlock> => {
  return makeRequest<TimeBlock>(`/time-blocks/${id}`);
};

// Create a new time block
export const createTimeBlock = async (
  data: CreateTimeBlockRequest
): Promise<TimeBlock> => {
  return makeRequest<TimeBlock>('/time-blocks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update an existing time block
export const updateTimeBlock = async (
  id: number,
  data: UpdateTimeBlockRequest
): Promise<TimeBlock> => {
  return makeRequest<TimeBlock>(`/time-blocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete a time block
export const deleteTimeBlock = async (id: number): Promise<void> => {
  await makeRequest<void>(`/time-blocks/${id}`, {
    method: 'DELETE',
  });
};
