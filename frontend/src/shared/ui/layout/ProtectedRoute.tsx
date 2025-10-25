import React from 'react';
import { Navigate } from 'react-router-dom';

import { env } from '@shared/env';
import { useAuth } from '@shared/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'tenant' | 'user' | ('admin' | 'tenant' | 'user')[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/login'
}) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  
  // Allow admin access in development mode only (commented out for testing)
  // if (env.DEV) {
  //   // Allow tenant access
  //   if (Array.isArray(requiredRole) && requiredRole.includes('tenant')) {
  //     return <>{children}</>;
  //   }
  //   if (requiredRole === 'tenant') {
  //     return <>{children}</>;
  //   }
  //   // Allow admin access
  //   if (Array.isArray(requiredRole) && requiredRole.includes('admin')) {
  //     return <>{children}</>;
  //   }
  //   if (requiredRole === 'admin') {
  //     return <>{children}</>;
  //   }
  // }
  
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
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check if user has required role
  if (Array.isArray(requiredRole)) {
    // User needs to have at least ONE of the required roles
    const hasRequiredRole = requiredRole.some(role => {
      if (role === 'admin') return isAdmin;
      if (role === 'tenant') return !isAdmin; // Tenants are authenticated non-admins
      if (role === 'user') return true; // Any authenticated user
      return false;
    });
    
    if (!hasRequiredRole) {
      return <Navigate to={fallbackPath} replace />;
    }
  } else {
    // Single role check
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to={fallbackPath} replace />;
    }
    
    if (requiredRole === 'tenant' && isAdmin) {
      return <Navigate to={fallbackPath} replace />;
    }
    
    if (requiredRole === 'user' && !isAuthenticated) {
      return <Navigate to={fallbackPath} replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
