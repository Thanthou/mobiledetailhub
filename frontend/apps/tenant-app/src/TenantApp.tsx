import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRouterDebug } from '@shared/hooks';
import { registerModalImporter, inPreviewMode } from '@shared/utils';

import { TenantPage } from '@tenant-app/components/header';
import { LazyRequestQuoteModal } from '@tenant-app/components/quotes';
import { DashboardPage } from '@tenant-app/components/tenantDashboard';
import { ProtectedRoute } from '@shared/ui';
import { SEOManager } from '@shared/bootstrap';

import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import PreviewPage from './components/PreviewPage';
import TenantLoginPage from './pages/TenantLoginPage';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('./components/booking/BookingApp'));


/**
 * Preview Routes Component
 * 
 * Handles all preview-related routing.
 * Preview pages use PreviewDataProvider (already mounted by TenantProviders).
 * No live data fetching occurs in preview mode.
 */
function PreviewRoutes() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading preview…</div>}>
      <Routes>
        {/* Industry-specific preview routes */}
        <Route path="/mobile-detailing-preview" element={<PreviewPage />} />
        <Route path="/mobile-detailing-preview/services/:serviceType" element={<ServicePage />} />
        <Route path="/house-cleaning-preview" element={<PreviewPage />} />
        <Route path="/house-cleaning-preview/services/:serviceType" element={<ServicePage />} />
        <Route path="/lawncare-preview" element={<PreviewPage />} />
        <Route path="/lawncare-preview/services/:serviceType" element={<ServicePage />} />
        <Route path="/pet-grooming-preview" element={<PreviewPage />} />
        <Route path="/pet-grooming-preview/services/:serviceType" element={<ServicePage />} />
        <Route path="/barber-preview" element={<PreviewPage />} />
        <Route path="/barber-preview/services/:serviceType" element={<ServicePage />} />
        
        {/* Generic preview route */}
        <Route path="/preview" element={<PreviewPage />} />
        
        {/* Catch-all for preview mode */}
        <Route path="*" element={<PreviewPage />} />
      </Routes>
    </Suspense>
  );
}

/**
 * Live Tenant Routes Component
 * 
 * Handles all live tenant routing.
 * These routes use LiveDataProvider (mounted by TenantProviders).
 * Fetches real tenant data from API.
 */
function LiveRoutes() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
      <Routes>
        {/* Root path - show tenant page */}
        <Route path="/" element={<TenantPage />} />
        
        {/* Login route */}
        <Route path="/login" element={<TenantLoginPage />} />
        
        {/* Tenant Dashboard - protected route (accessible via /admin or /dashboard) */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/login">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/login">
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Booking route */}
        <Route path="/booking" element={<Booking />} />
        
        {/* Note: Service routes now handled via tenant slug pattern below */}
        
        {/* Service routes - must come before generic businessSlug route */}
        <Route path=":businessSlug/services/:serviceType" element={<ServicePage />} />
        
        {/* Business-specific dashboard (accessible via /admin or /dashboard) */}
        <Route path=":businessSlug/admin" element={
          <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/login">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path=":businessSlug/dashboard" element={
          <ProtectedRoute requiredRole={['admin', 'tenant']} fallbackPath="/login">
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Business-specific booking */}
        <Route path=":businessSlug/booking" element={<Booking />} />
        
        {/* Tenant-specific home page */}
        <Route path=":businessSlug" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}

export default function TenantApp() {
  useRouterDebug('TenantApp');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const isPreview = inPreviewMode();

  // Register modal importers for prefetching (skip in preview)
  useEffect(() => {
    if (isPreview) return;
    
    registerModalImporter('quote', () => 
      import('@tenant-app/components/quotes/components/RequestQuoteModal') as Promise<{ default: React.ComponentType<unknown> }>
    );
    registerModalImporter('login', () => 
      import('@shared/auth/components/LoginModal') as Promise<{ default: React.ComponentType<unknown> }>
    );
  }, [isPreview]);

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <>
      <SEOManager />
      
      {/* Split routing: preview vs live */}
      {isPreview ? <PreviewRoutes /> : <LiveRoutes />}
      
      {/* Quote Modal (only in live mode) */}
      {!isPreview && (
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen}
          onClose={handleCloseQuoteModal}
        />
      )}
    </>
  );
}
