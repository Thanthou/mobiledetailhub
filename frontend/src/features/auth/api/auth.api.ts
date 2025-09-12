import type { 
  AuthErrorResponse,
  AuthResponse,
  LoginRequest, 
  RegisterRequest, 
  Session,
  User} from '../schemas/auth.schemas';

// API base URL - should match your backend configuration
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3001';

// Custom error class for auth-specific errors
export class AuthError extends Error {
  code?: string;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  resetTime?: string;

  constructor(message: string, code?: string, retryAfterSeconds?: number, remainingAttempts?: number, resetTime?: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
    this.remainingAttempts = remainingAttempts;
    this.resetTime = resetTime;
  }
}

// Generic API request function
async function makeAuthRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => { 
      controller.abort(); 
    }, 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json() as T & AuthErrorResponse;
    
    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        throw new AuthError(
          data.error || 'Rate limited',
          'RATE_LIMITED',
          data.retryAfterSeconds,
          data.remainingAttempts,
          data.resetTime
        );
      }
      
      // Handle other error codes
      if (response.status === 401) {
        throw new AuthError(data.error || 'Unauthorized', 'UNAUTHORIZED');
      }
      
      if (response.status === 403) {
        throw new AuthError(data.error || 'Forbidden', 'FORBIDDEN');
      }
      
      if (response.status === 422) {
        throw new AuthError(data.error || 'Validation error', 'VALIDATION_ERROR');
      }
      
      throw new AuthError(data.error || 'Authentication failed');
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AuthError('Request timeout', 'TIMEOUT');
    }
    
    console.error('Auth API request failed:', error);
    throw new AuthError(error instanceof Error ? error.message : 'An error occurred');
  }
}

// Auth API functions
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return makeAuthRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return makeAuthRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return makeAuthRequest<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout user
  async logout(accessToken: string, deviceId?: string): Promise<{ success: boolean; message: string }> {
    return makeAuthRequest<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ deviceId }),
    });
  },

  // Logout from specific device
  async logoutDevice(accessToken: string, deviceId: string): Promise<{ success: boolean; message: string }> {
    return makeAuthRequest<{ success: boolean; message: string }>('/api/auth/logout-device', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ deviceId }),
    });
  },

  // Get current user
  async getCurrentUser(accessToken: string): Promise<User> {
    return makeAuthRequest<User>('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  },

  // Get user sessions
  async getUserSessions(accessToken: string): Promise<Session[]> {
    return makeAuthRequest<Session[]>('/api/auth/sessions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  },

  // Update user profile
  async updateProfile(accessToken: string, updates: Partial<Pick<User, 'name' | 'phone'>>): Promise<User> {
    return makeAuthRequest<User>('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });
  },

  // Change password
  async changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return makeAuthRequest<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return makeAuthRequest<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return makeAuthRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Utility functions
export const authUtils = {
  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },

  // Generate device ID from user agent and IP
  generateDeviceId(userAgent: string, ip: string): string {
    const data = `${userAgent}-${ip}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // Store tokens in localStorage
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Get tokens from localStorage
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  },

  // Clear tokens from localStorage
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
