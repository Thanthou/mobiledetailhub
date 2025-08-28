import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import { MDHConfigProvider } from './contexts/MDHConfigContext';
import { AffiliateProvider } from './contexts/AffiliateContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import { DashboardPage as AdminDashboard } from './pages/adminDashboard';
import { AffiliateApplicationPage } from './pages/affiliateOnboarding';
import Header from './components/01_header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import NotFoundPage from './components/shared/NotFoundPage';
import AdminNavigationContainer from './components/shared/AdminNavigationContainer';
import { useScrollToTop } from './hooks/useScrollToTop';
import { scrollRestoration } from './utils/scrollRestoration';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { preloadCriticalModals } from './utils/modalCodeSplitting';

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
      preloadCriticalModals().catch(error => {
        console.debug('Modal preloading failed:', error);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <MDHConfigProvider>
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
            </Router>
          </MDHConfigProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;