import React, { createContext, useCallback, useEffect, useState } from 'react';

import { apiService } from '@/shared/api/api';
import { apiClient } from '@/shared/api/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
  role: 'user' | 'affiliate' | 'admin';
  affiliate_id?: number | undefined;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to map backend user data to frontend User interface
const mapBackendUserToFrontend = (backendUser: unknown): User => {
  const user = backendUser as {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: 'user' | 'affiliate' | 'admin';
    is_admin?: boolean;
    affiliate_id?: number;
  };
  // Handle both backend API response format and saved user format
  let role: 'user' | 'affiliate' | 'admin' = 'user';
  
  if (user.role !== undefined) {
    // If role is already set (from saved user data)
    role = user.role;
  } else if (user.is_admin) {
    // If is_admin flag is present (from API response)
    role = 'admin';
  }
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: role,
    affiliate_id: user.affiliate_id
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await apiClient.get('/api/auth/me');
      const mappedUser = mapBackendUserToFrontend(userData);
      setUser(mappedUser);
      // Update localStorage with properly mapped user data
      localStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (error: unknown) {
      console.error('AuthContext: Error fetching user data:', error);
      // If it's an auth error, logout user
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');
    
    
    if (token && refreshToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser) as unknown;
        // Map the saved user data to ensure proper role
        const mappedUser = mapBackendUserToFrontend(userData);
        setUser(mappedUser);
        setLoading(false);
        
        // Verify token is still valid on mount
        void fetchUserData();
      } catch (error: unknown) {
        console.error('Error parsing saved user data:', error);
        // If parsing fails, fetch fresh data
        void fetchUserData();
      }
    } else if (token && refreshToken) {
      // Verify token and get user data
      void fetchUserData();
    } else {
      // No valid tokens, clear any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setLoading(false);
    }
  }, [fetchUserData]);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (user === null) return;
    
    const interval = setInterval(() => {
      void (async () => {
        try {
          // Use API client which handles token refresh automatically
          await apiClient.get('/api/auth/me');
        } catch (error: unknown) {
          console.error('Error during periodic token check:', error);
          // If it's an auth error, logout user
          if (error instanceof Error && error.message.includes('Authentication failed')) {
            logout();
          }
        }
      })();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => { clearInterval(interval); };
  }, [user, logout]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.login(email, password);

      if (response.success) {
        const mappedUser = mapBackendUserToFrontend(response.user);
        setUser(mappedUser);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      // Handle specific error codes
      if (err.code === 'RATE_LIMITED') {
        return { success: false, error: `Rate limited: ${err.message ?? 'Unknown error'}` };
      }
      if (err.code === 'INVALID_CREDENTIALS') {
        return { success: false, error: 'Email or password is incorrect' };
      }
      if (err.code === 'FORBIDDEN') {
        return { success: false, error: 'Access denied. Please contact support.' };
      }
      if (err.code === 'TIMEOUT') {
        return { success: false, error: 'Login request timed out. Please check your connection and try again.' };
      }
      if (err.code === 'NETWORK_ERROR') {
        return { success: false, error: 'Network error. Please check your connection and try again.' };
      }
      
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.register(email, password, name, phone);

      if (response.success) {
        const mappedUser = mapBackendUserToFrontend(response.user);
        setUser(mappedUser);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      // Handle specific error codes
      if (err.code === 'RATE_LIMITED') {
        return { success: false, error: `Rate limited: ${err.message ?? 'Unknown error'}` };
      }
      if (err.code === 'VALIDATION_ERROR') {
        return { success: false, error: err.message || 'Validation failed' };
      }
      
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

