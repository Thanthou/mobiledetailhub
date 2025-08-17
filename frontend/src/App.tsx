import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="bg-white">
            <Routes>
              {/* Main routes - all business paths go to HomePage */}
              <Route path="/" element={<HomePage />} />
              <Route path="/:businessSlug" element={<HomePage />} />
              
              {/* Catch all other routes */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}


export default App;