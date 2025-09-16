import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { DashboardPage as AdminDashboard } from '@/features/adminDashboard';
import { DashboardPage } from '@/features/affiliateDashboard';
import { AffiliateApplicationPage } from '@/features/affiliateOnboarding';
import { BookingPage } from '@/features/booking';
import { Header } from '@/features/header';
import { HomePage } from '@/features/home';
import { ServicePage } from '@/features/services';
import { AffiliateProvider } from '@/shared/contexts';
import { useScrollToTop } from '@/shared/hooks';
import { AdminNavigationContainer, NotFoundPage, ProtectedRoute } from '@/shared/ui';

// Component to handle scroll-to-top functionality
const ScrollToTop = () => {
  useScrollToTop();
  return null;
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
      <AdminNavigationContainer />
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin" fallbackPath="/">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/affiliate-dashboard" element={
            <ProtectedRoute requiredRole="affiliate" fallbackPath="/">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/affiliate-onboarding" element={<AffiliateApplicationPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/:businessSlug/booking" element={
            <AffiliateProvider>
              <BookingPage />
            </AffiliateProvider>
          } />
          <Route path="/service/:serviceType" element={<ServicePage />} />
          <Route path="/:businessSlug/service/:serviceType" element={
            <AffiliateProvider>
              <ServicePage />
            </AffiliateProvider>
          } />
          <Route path="/:businessSlug/dashboard" element={
            <ProtectedRoute requiredRole={['admin', 'affiliate']} fallbackPath="/">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/:businessSlug" element={
            <AffiliateProvider>
              <Header />
              <HomePage />
            </AffiliateProvider>
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
