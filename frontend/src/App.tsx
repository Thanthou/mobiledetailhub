import React from 'react';
import HomePage from './components/HomePage';
import { LocationProvider } from './contexts/LocationContext';

function App() {
  return (
    <LocationProvider>
      <div className="bg-white">
        <HomePage />
      </div>
    </LocationProvider>
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