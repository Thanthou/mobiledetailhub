import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/affiliateDashboard/DashboardPage';
import Header from './components/01_header';
import DevModeDropdown from './components/DevModeDropdown';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div>
            <DevModeDropdown />
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