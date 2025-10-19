import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRouterDebug } from '@/shared/useRouterDebug';

import { DataProvider, TenantPage } from '@/tenant-app/components/header';
import { LazyRequestQuoteModal } from '@/tenant-app/components/quotes';
import { DashboardPage } from '@/tenant-app/components/tenantDashboard';
import TenantApplicationPage from '@/admin-app/components/tenantOnboarding/components/TenantApplicationPage';
import { LoginPage, ProtectedRoute } from '@/shared/ui';

import HomePage from '@main/pages/HomePage';
import ServicePage from '@main/pages/ServicePage';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('./components/booking/BookingApp'));


export default function TenantApp() {
  useRouterDebug('TenantApp');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const routes = (
    <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
      <Routes>
        {/* Root path - show tenant page */}
        <Route path="/" element={<TenantPage />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Tenant Dashboard - protected route */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/">
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Tenant Application */}
        <Route path="/tenant-onboarding" element={<TenantApplicationPage />} />
        
        {/* Booking route */}
        <Route path="/booking" element={<Booking />} />
        
        {/* Redirect old service routes to tenant-based structure */}
        <Route path="/services/:serviceType" element={<Navigate to="/services/:serviceType" replace />} />
        
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
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {routes}
      
      {/* Quote Modal */}
      <LazyRequestQuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
      />
    </div>
  );
}
