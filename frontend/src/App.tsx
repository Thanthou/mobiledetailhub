import React from 'react';
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

// Configuration object for shared data (not used - business config is loaded dynamically)
const config = {
  header: {
    businessName: "JP's Mobile Detail",
    phone: '', // Loaded from business config
    location: 'Bullhead City, AZ',
    navLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Contact', href: '/contact' }
    ]
  },
  hero: {
    backgroundImage: '/car3.png',
    headline: 'Premium Mobile Detailing',
    subheadline: '',
    ctaText: 'Book Now',
    ctaLink: '/booking?detailer_id=joe123'
  },
  footer: {
    contactPhone: '', // Loaded from business config
    location: 'Bullhead City, AZ',
    email: 'service@jpsmobiledetail.com',
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Contact', href: '/contact' }
    ],
    attribution: {
      text: 'Powered by MobileDetailHub',
      link: 'https://mobiledetailhub.com'
    }
  }
};
export default App;