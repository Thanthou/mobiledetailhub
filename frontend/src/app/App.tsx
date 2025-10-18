import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage as AdminDashboard } from '@/features/adminDashboard';
import { DataProvider, TenantPage } from '@/features/header';
import { PreviewGeneratorPage, PreviewPage } from '@/features/preview';
import { LazyRequestQuoteModal } from '@/features/quotes';
import { DashboardPage } from '@/features/tenantDashboard';
import { TenantApplicationPage } from '@/features/tenantOnboarding';
import { env } from '@/shared/env';
import { LoginPage, ProtectedRoute } from '@/shared/ui';

import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import { Providers } from './providers';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('../features/booking/BookingApp'));

export default function App() {
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
        {/* Only redirect to admin dashboard if on main domain, not tenant subdomains */}
        <Route path="/" element={
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? <Navigate to="/admin-dashboard" replace />
            : <TenantPage />
        } />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard - must come before tenant routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin" fallbackPath="/login">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Specific routes first */}
        <Route path="/locations/:slug" element={<HomePage onRequestQuote={handleOpenQuoteModal} />} />
        <Route path="/service/:slug" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
        <Route path="/services/:slug" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
        
        {/* Development-only tenant-based service routes */}
        {env.DEV && (
          <Route path="/:tenantSlug/services/:serviceType" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
        )}
        
        {/* Booking routes */}
        <Route path="/locations/:slug/book" element={<Booking />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/booking" element={<Booking />} />
        
        {/* Tenant Onboarding route */}
        <Route path="/tenant-onboarding" element={<TenantApplicationPage />} />
        
        {/* Preview routes - for sales demos */}
        <Route path="/preview-generator" element={<PreviewGeneratorPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        
        {/* Tenant Dashboard route - handle both subdomain and path-based routing */}
        <Route path="/dashboard" element={
          <DataProvider>
            <DashboardPage />
          </DataProvider>
        } />
        
        {/* Tenant routes - now no conflicts! */}
        <Route path="/:slug/dashboard" element={
          <DataProvider>
            <DashboardPage />
          </DataProvider>
        } />
        <Route path="/:slug" element={<TenantPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
  
  return (
    <Providers>
      {routes}
      
      {/* Global Quote Modal - Only render when open */}
      {isQuoteModalOpen && (
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={handleCloseQuoteModal} 
        />
      )}
    </Providers>
  );
}