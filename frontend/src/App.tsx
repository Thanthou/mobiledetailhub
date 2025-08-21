import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import AdminDashboard from './pages/adminDashboard/Dashboard';
import Header from './components/01_header';
const DevModeDropdown = import.meta.env.DEV 
  ? React.lazy(() => import('./components/DevModeDropdown'))
  : null;
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
    <AuthProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <div>
          {import.meta.env.DEV && DevModeDropdown && <DevModeDropdown />}
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/affiliate-dashboard" element={<DashboardPage />} />
            <Route path="/client-dashboard" element={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><h1 className="text-white text-2xl">Client Dashboard Coming Soon</h1></div>} />
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
            <Route path="*" element={
              <>
                <Header />
                <HomePage />
              </>
            } />
          </Routes>
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;