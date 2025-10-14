import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/shared/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'tenant' | 'user' | ('admin' | 'tenant' | 'user')[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/'
}) => {
  const authContext = useAuth() as { user: { id: string; name: string; email: string; role: 'admin' | 'affiliate' | 'user' } | null; loading: boolean };
  
  // Safely extract user and loading with proper type checking
  const user = authContext.user;
  const loading = authContext.loading;
  
  // In development mode, allow access to dashboards without authentication
  if (import.meta.env.DEV) {
    // Allow tenant access
    if (Array.isArray(requiredRole) && requiredRole.includes('tenant')) {
      return <>{children}</>;
    }
    if (requiredRole === 'tenant') {
      return <>{children}</>;
    }
    // Allow admin access
    if (Array.isArray(requiredRole) && requiredRole.includes('admin')) {
      return <>{children}</>;
    }
    if (requiredRole === 'admin') {
      return <>{children}</>;
    }
  }
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check if user has required role
  if (Array.isArray(requiredRole)) {
    const userRole = user.role;
    if (!requiredRole.includes(userRole)) {
      return <Navigate to={fallbackPath} replace />;
    }
  } else {
    const userRole = user.role;
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to={fallbackPath} replace />;
    }
    
    if (requiredRole === 'tenant' && userRole !== 'tenant') {
      return <Navigate to={fallbackPath} replace />;
    }
  }
  
  // Check if user has valid token for admin access
  if (Array.isArray(requiredRole) ? requiredRole.includes('admin') : requiredRole === 'admin') {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to={fallbackPath} replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
