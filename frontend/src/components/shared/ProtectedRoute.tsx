import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'affiliate' | 'user' | ('admin' | 'affiliate' | 'user')[];
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
    
    if (requiredRole === 'affiliate' && userRole !== 'affiliate') {
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
