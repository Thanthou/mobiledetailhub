import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import { MDHConfigProvider } from './contexts/MDHConfigContext';
import { AffiliateProvider } from './contexts/AffiliateContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import AdminDashboard from './pages/adminDashboard/Dashboard';
import { AffiliateApplicationPage } from './pages/affiliateOnboarding';
import Header from './components/01_header';
import ErrorBoundary from './components/shared/ErrorBoundary';
const DevModeDropdown = import.meta.env.DEV 
  ? React.lazy(() => import('./components/DevModeDropdown'))
  : null;

// Custom error boundary for lazy-loaded components
const LazyComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-2 text-xs text-gray-500">
        Component failed to load
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
import { useScrollToTop } from './hooks/useScrollToTop';

// Component to handle scroll-to-top functionality
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

// Simple login page component
const LoginPage = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const handleClose = () => setIsOpen(false);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-4">Login Required</h1>
        <p className="text-gray-300 mb-6">Please log in to access the admin dashboard.</p>
        <button 
          onClick={() => window.location.href = '/admin-dashboard'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <ScrollToTop />
            <div>
            {import.meta.env.DEV && DevModeDropdown && (
              <LazyComponentErrorBoundary>
                <DevModeDropdown />
              </LazyComponentErrorBoundary>
            )}
              <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/affiliate-dashboard" element={<DashboardPage />} />
              <Route path="/affiliate-onboarding" element={<AffiliateApplicationPage />} />
              <Route path="/client-dashboard" element={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><h1 className="text-white text-2xl">Client Dashboard Coming Soon</h1></div>} />
              <Route path="/:businessSlug" element={
                <MDHConfigProvider>
                  <AffiliateProvider>
                    <Header />
                    <HomePage />
                  </AffiliateProvider>
                </MDHConfigProvider>
              } />
              <Route path="/" element={
                <MDHConfigProvider>
                  <Header />
                  <HomePage />
                </MDHConfigProvider>
              } />
              <Route path="*" element={
                <MDHConfigProvider>
                  <Header />
                  <HomePage />
                </MDHConfigProvider>
              } />
            </Routes>
            </div>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;