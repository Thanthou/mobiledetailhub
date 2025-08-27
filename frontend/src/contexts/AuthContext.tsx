import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/environment';

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
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
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
    } else if (token) {
      // Verify token and get user data
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && user) {
        // Silently check if token is still valid
        fetch(`${config.apiUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          if (response.status === 401) {
            console.log('Token expired during periodic check, logging out user');
            logout();
          }
        }).catch(error => {
          console.error('Error during periodic token check:', error);
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const mappedUser = mapBackendUserToFrontend(userData);
        setUser(mappedUser);
        // Update localStorage with properly mapped user data
        localStorage.setItem('user', JSON.stringify(mappedUser));
      } else if (response.status === 401) {
        // Token is expired or invalid, logout user
        console.log('Token expired, logging out user');
        logout();
      } else {
        // Other error, remove tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Network error, logout user to be safe
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${config.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const mappedUser = mapBackendUserToFrontend(data.user);
        setUser(mappedUser);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${config.apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        const mappedUser = mapBackendUserToFrontend(data.user);
        setUser(mappedUser);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
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