import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';

import { DashboardPage as AdminDashboard } from '@/features/adminDashboard';
import { DashboardPage } from '@/features/tenantDashboard';
import { TenantApplicationPage } from '@/features/tenantOnboarding';
import { BookingPage } from '@/features/booking';
import { Header } from '@/features/header';
import HomePage from '@/app/pages/HomePage';
import { ServicesGrid as ServicePage } from '@/features/services';
import { useScrollToTop } from '@/shared/hooks';
import { NotFoundPage, ProtectedRoute } from '@/shared/ui';
import { locationRoutes } from '@/routes/locationRoutes';

// Component to handle scroll-to-top functionality
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

// Component to redirect old service routes to tenant-based structure
const ServiceRedirect = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  return <Navigate to={`/jps/services/${serviceType}`} replace />;
};

// Simple login page component
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-4">Login Required</h1>
        <p className="text-gray-300 mb-6">Please log in to access protected areas.</p>
        <p className="text-gray-400 text-sm">Use the login button in the header to authenticate.</p>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin" fallbackPath="/">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/tenant-dashboard" element={
            <ProtectedRoute requiredRole="affiliate" fallbackPath="/">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/tenant-onboarding" element={<TenantApplicationPage />} />
          <Route path="/booking" element={<BookingPage />} />
          
          {/* Redirect old service routes to tenant-based structure */}
          <Route path="/services/:serviceType" element={<ServiceRedirect />} />
          
          {/* Service routes - must come before generic businessSlug route */}
          <Route path="/:businessSlug/services/:serviceType" element={<ServicePage />} />
          
          <Route path="/:businessSlug/dashboard" element={
            <div style={{ padding: '20px', background: 'red', color: 'white' }}>
              <h1>DASHBOARD ROUTE MATCHED!</h1>
              <p>Business Slug: {window.location.pathname.split('/')[1]}</p>
              <ProtectedRoute requiredRole={['admin', 'affiliate']} fallbackPath="/">
                  <DashboardPage />
              </ProtectedRoute>
            </div>
          } />
          <Route path="/:businessSlug/booking" element={
              <BookingPage />
          } />
          {locationRoutes.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="/:businessSlug" element={
            <>
              <Header />
              <HomePage />
            </>
          } />
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
            </>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
};
