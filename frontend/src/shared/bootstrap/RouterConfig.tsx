import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage, ProtectedRoute } from '@shared/ui';

export interface RouterConfigProps {
  /**
   * App type for determining route behavior
   */
  appType: 'admin' | 'main' | 'tenant';
  
  /**
   * Custom routes specific to each app
   */
  children: React.ReactNode;
  
  /**
   * Loading component for Suspense fallback
   */
  loadingComponent?: React.ReactNode;
}

/**
 * Shared router configuration that provides common route patterns
 * and reduces duplication across apps
 */
export const RouterConfig: React.FC<RouterConfigProps> = ({ 
  appType, 
  children, 
  loadingComponent = <div className="p-8 text-white">Loading…</div> 
}) => {
  return (
    <Suspense fallback={loadingComponent}>
      <Routes>
        {children}
        
        {/* Common login route for admin and tenant apps */}
        {(appType === 'admin' || appType === 'tenant') && (
          <Route path="/login" element={<LoginPage />} />
        )}
        
        {/* Catch-all route - behavior depends on app type */}
        <Route path="*" element={
          appType === 'admin' ? (
            <Navigate to="/admin-dashboard" replace />
          ) : appType === 'main' ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </Suspense>
  );
};

/**
 * Higher-order component for wrapping apps with RouterConfig
 */
export function withRouterConfig<T extends object>(
  Component: React.ComponentType<T>,
  appType: RouterConfigProps['appType'],
  loadingComponent?: React.ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <RouterConfig appType={appType} loadingComponent={loadingComponent}>
        <Component {...props} />
      </RouterConfig>
    );
  };
}
