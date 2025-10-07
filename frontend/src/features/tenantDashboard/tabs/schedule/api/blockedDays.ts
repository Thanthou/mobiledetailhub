const API_BASE = '/api/schedule';

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export interface BlockedDay {
  blocked_date: string;
  reason?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}

export interface ToggleBlockedDayResponse {
  action: 'added' | 'removed';
  date: string;
  reason?: string;
  message: string;
}

// Get blocked days for a date range
export const getBlockedDays = async (startDate: string, endDate: string): Promise<BlockedDay[]> => {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  
  return makeRequest(`/blocked-days?${params}`);
};

// Toggle blocked day (add if not exists, remove if exists)
export const toggleBlockedDay = async (date: string, reason?: string): Promise<ToggleBlockedDayResponse> => {
  return makeRequest('/blocked-days/toggle', {
    method: 'POST',
    body: JSON.stringify({ date, reason }),
  });
};

// Add blocked day
export const addBlockedDay = async (data: {
  date: string;
  reason?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}): Promise<BlockedDay> => {
  return makeRequest('/blocked-days', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Remove blocked day
export const removeBlockedDay = async (date: string): Promise<{ message: string; date: string }> => {
  return makeRequest(`/blocked-days/${date}`, {
    method: 'DELETE',
  });
};
