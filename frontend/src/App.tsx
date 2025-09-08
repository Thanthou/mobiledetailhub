import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminNavigationContainer from './components/shared/AdminNavigationContainer';
import ErrorBoundary from './components/shared/ErrorBoundary';
import NotFoundPage from './components/shared/NotFoundPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { AffiliateProvider } from './contexts/AffiliateContext';
import { AuthProvider } from './contexts/AuthContext';
import { FAQProvider } from './contexts/FAQContext';
import { LocationProvider } from './contexts/LocationContext';
import { MDHConfigProvider } from './contexts/MDHConfigContext';
import { useScrollToTop } from './hooks/useScrollToTop';
import { DashboardPage as AdminDashboard } from './pages/adminDashboard';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import { AffiliateApplicationPage } from './pages/affiliateOnboarding';
import { HomePage } from './pages/home';
import Header from './pages/home/components/01_header';
import { ServicePage } from './pages/serviceSection';
import { preloadCriticalModals } from './utils/modalCodeSplitting';
import { scrollRestoration } from './utils/scrollRestoration';

// Custom error boundary for lazy-loaded components (removed unused component)
// const LazyComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <ErrorBoundary
//     fallback={
//       <div className="p-2 text-xs text-gray-500">
//         Component failed to load
//       </div>
//     }
//   >
//     {children}
//   </ErrorBoundary>
// );

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

function App() {
  // Global scroll restoration effect
  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Cleanup scroll positions on app unmount
    return () => {
      scrollRestoration.clearScrollPositions();
    };
  }, []);

  // Preload critical modals for better performance
  useEffect(() => {
    // Start preloading after app initializes
    const timer = setTimeout(() => {
      void preloadCriticalModals().catch((error: unknown) => {
        // Modal preloading failed
        console.warn('Modal preloading failed:', error);
      });
    }, 1000);

    return () => { clearTimeout(timer); };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <MDHConfigProvider>
            <FAQProvider>
              <Router>
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
                    <Route path="/service/:serviceType" element={<ServicePage />} />
                    <Route path="/:businessSlug/service/:serviceType" element={
                      <AffiliateProvider>
                        <ServicePage />
                      </AffiliateProvider>
                    } />

                    <Route path="/:businessSlug" element={
                      <AffiliateProvider>
                        <Header />
                        <HomePage />
                      </AffiliateProvider>
                    } />
                    <Route path="/:businessSlug/dashboard" element={
                      <ProtectedRoute requiredRole={['admin', 'affiliate']} fallbackPath="/">
                        <DashboardPage />
                      </ProtectedRoute>
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
              </Router>
            </FAQProvider>
          </MDHConfigProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;