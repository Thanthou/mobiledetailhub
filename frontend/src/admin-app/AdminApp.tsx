import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage as AdminDashboard } from './components/adminDashboard';
import { PreviewGeneratorPage, PreviewPage } from '@/admin-app/components/preview';
import { LoginPage, ProtectedRoute } from '@/shared/ui';
import { SEOManager } from '@/shared/bootstrap';

export default function AdminApp() {
  const routes = (
    <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
      <Routes>
        {/* Admin Dashboard - redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard - protected route */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin" fallbackPath="/login">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Preview routes */}
        <Route path="/preview-generator" element={<PreviewGeneratorPage />} />
        <Route path="/preview/:tenantSlug" element={<PreviewPage />} />
        
        {/* Catch all - redirect to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </Suspense>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <SEOManager />
      {routes}
    </div>
  );
}
