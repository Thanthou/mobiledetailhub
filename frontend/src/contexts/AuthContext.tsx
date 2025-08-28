import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/environment';
import { apiClient } from '../services/apiClient';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'affiliate' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map backend user data to frontend User interface
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    role: backendUser.is_admin ? 'admin' : 'user'
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && refreshToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Map the saved user data to ensure proper role
        const mappedUser = mapBackendUserToFrontend(userData);
        setUser(mappedUser);
        setLoading(false);
        
        // Verify token is still valid on mount
        fetchUserData(token);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // If parsing fails, fetch fresh data
        fetchUserData(token);
      }
    } else if (token && refreshToken) {
      // Verify token and get user data
      fetchUserData(token);
    } else {
      // No valid tokens, clear any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setLoading(false);
    }
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        // Use API client which handles token refresh automatically
        await apiClient.get('/api/auth/me');
      } catch (error) {
        console.error('Error during periodic token check:', error);
        // If it's an auth error, logout user
        if (error instanceof Error && error.message.includes('Authentication failed')) {
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const fetchUserData = async (token: string) => {
    try {
      const userData = await apiClient.get('/api/auth/me');
      const mappedUser = mapBackendUserToFrontend(userData);
      setUser(mappedUser);
      // Update localStorage with properly mapped user data
      localStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If it's an auth error, logout user
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error: any) {
      // Handle specific error codes
      if (error.code === 'RATE_LIMITED') {
        return { success: false, error: `Rate limited: ${error.message}` };
      }
      if (error.code === 'INVALID_CREDENTIALS') {
        return { success: false, error: 'Email or password is incorrect' };
      }
      if (error.code === 'FORBIDDEN') {
        return { success: false, error: 'Access denied. Please contact support.' };
      }
      
      return { success: false, error: error.message || 'Network error occurred' };
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
    } catch (error: any) {
      // Handle specific error codes
      if (error.code === 'RATE_LIMITED') {
        return { success: false, error: `Rate limited: ${error.message}` };
      }
      if (error.code === 'VALIDATION_ERROR') {
        return { success: false, error: error.message || 'Validation failed' };
      }
      
      return { success: false, error: error.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};