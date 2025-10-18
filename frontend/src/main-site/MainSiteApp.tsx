import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRouterDebug } from '@/shared/useRouterDebug';

import { DashboardPage as AdminDashboard } from '@/features/adminDashboard';
import { DataProvider } from '@/features/header';
import { PreviewGeneratorPage, PreviewPage } from '@/features/preview';
import { LazyRequestQuoteModal } from '@/features/quotes';
import { DashboardPage } from '@/features/tenantDashboard';
import { TenantApplicationPage } from '@/features/tenantOnboarding';
import { env } from '@/shared/env';
import { LoginPage, ProtectedRoute } from '@/shared/ui';

import HomePage from '@main/pages/HomePage';
import ServicePage from '@main/pages/ServicePage';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('../features/booking/BookingApp'));


export default function MainSiteApp() {
  useRouterDebug('MainSiteApp');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
      <Routes>
          {/* Root path - show main site landing page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Dashboard - protected route */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin" fallbackPath="/login">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Tenant Dashboard - protected route */}
          <Route path="/tenant-dashboard" element={
            <ProtectedRoute requiredRole="tenant" fallbackPath="/login">
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Tenant Application */}
          <Route path="/tenant-onboarding" element={<TenantApplicationPage />} />
          
          {/* Booking route */}
          <Route path="/booking" element={<Booking />} />
          
          {/* Preview routes */}
          <Route path="/preview-generator" element={<PreviewGeneratorPage />} />
          <Route path="/preview/:tenantSlug" element={<PreviewPage />} />
          
          {/* Service routes - must come before generic businessSlug route */}
          <Route path="/:businessSlug/services/:serviceType" element={<ServicePage />} />
          
          <Route path="/:businessSlug/dashboard" element={
            <div style={{ padding: '20px', background: 'red', color: 'white' }}>
              <h1>DASHBOARD ROUTE MATCHED!</h1>
              <p>Business Slug: {window.location.pathname.split('/')[1]}</p>
              <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
                  <DashboardPage />
              </ProtectedRoute>
            </div>
          } />
          <Route path="/:businessSlug/booking" element={<Booking />} />
          
          {/* Tenant-specific routes */}
          <Route path="/:businessSlug" element={<HomePage />} />
          
          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        
        {/* Quote Modal */}
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen}
          onClose={handleCloseQuoteModal}
        />
      </div>
  );
}
