import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './providers';
import { LazyRequestQuoteModal } from '@/features/quotes';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import { TenantPage, DataProvider } from '@/features/header';
import { DashboardPage } from '@/features/tenantDashboard';
import DevNavigation from '@/features/header/components/DevNavigation';

// Heavy modules are NOT imported here - they stay out of the initial bundle
const Booking = lazy(() => import('../features/booking/BookingApp'));

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => setIsQuoteModalOpen(true);
  const handleCloseQuoteModal = () => setIsQuoteModalOpen(false);
  
  return (
    <Providers>
      {/* Development Navigation - Always visible */}
      <DevNavigation />
      
      <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/jps" replace />} />
          
          {/* Specific routes first */}
          <Route path="/locations/:slug" element={<HomePage onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/service/:slug" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
          <Route path="/services/:slug" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
          
          {/* Development-only tenant-based service routes */}
          {import.meta.env.DEV && (
            <Route path="/:tenantSlug/services/:serviceType" element={<ServicePage onRequestQuote={handleOpenQuoteModal} />} />
          )}
          
          {/* Booking routes */}
          <Route path="/locations/:slug/book" element={<Booking />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/booking" element={<Booking />} />
          
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