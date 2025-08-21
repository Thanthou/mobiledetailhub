import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import Header from './components/01_header';
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
            <Routes>
            <Route path="/affiliate-dashboard" element={<DashboardPage />} />
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