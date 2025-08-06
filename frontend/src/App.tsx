import React from 'react';
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="bg-white">
      <HomePage />
    </div>
  );
}

// Configuration object for shared data
const config = {
  header: {
    businessName: "JP's Mobile Detail",
    phone: '(702) 420-3151',
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
    contactPhone: '(702) 420-3151',
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