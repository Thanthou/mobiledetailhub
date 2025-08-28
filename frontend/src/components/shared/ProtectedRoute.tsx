import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'affiliate' | 'user';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/'
}) => {
  const { user, loading } = useAuth();
  
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
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to={fallbackPath} replace />;
  }
  
  if (requiredRole === 'affiliate' && user.role !== 'affiliate') {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check if user has valid token for admin access
  if (requiredRole === 'admin') {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to={fallbackPath} replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
