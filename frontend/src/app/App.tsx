import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './providers';

const HomePage = lazy(() => import('./pages/HomePage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));

// Heavy modules are NOT imported here - they stay out of the initial bundle
// When you're ready to re-enable booking, uncomment and add this route:
// const Booking = lazy(() => import('../features/booking/BookingApp'));

export default function App() {
  return (
    <Providers>
      <Suspense fallback={<div className="p-8 text-white">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:slug" element={<HomePage />} />
          <Route path="/:state/:city" element={<HomePage />} />
          <Route path="/service/:slug" element={<ServicePage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          
          {/* Heavy modules - add back when ready:
          <Route path="/locations/:slug/book" element={<Booking />} />
          <Route path="/book" element={<Booking />} />
          */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}