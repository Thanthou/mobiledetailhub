import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import AdminDashboard from './pages/adminDashboard/Dashboard';
import Header from './components/01_header';
import DevModeDropdown from './components/DevModeDropdown';
import { useScrollToTop } from './hooks/useScrollToTop';

// Component to handle scroll-to-top functionality
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <div>
            <DevModeDropdown />
            <Routes>
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