import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage as AdminDashboard } from '@/features/adminDashboard';
import { PreviewGeneratorPage, PreviewPage } from '@/features/preview';
import { LoginPage, ProtectedRoute } from '@/shared/ui';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('../features/booking/BookingApp'));

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
        
        {/* Booking route for admin testing */}
        <Route path="/booking" element={<Booking />} />
        
        {/* Catch all - redirect to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </Suspense>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {routes}
    </div>
  );
}
