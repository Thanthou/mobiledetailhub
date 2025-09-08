import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | undefined;
    role: 'user' | 'affiliate' | 'admin';
    affiliate_id?: number | undefined;
  } | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
