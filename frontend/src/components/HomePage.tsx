import React, { useState } from 'react';
import { Car, Shield, Paintbrush, Palette, Sun, Zap, Ship } from 'lucide-react';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import Contact from './Contact';
import Affiliates from './Affiliates';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import FAQ from './FAQ';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.offsetTop;
    const offset = 80; // Additional scroll down
    window.scrollTo({ top: elementPosition + offset, behavior: 'smooth' });
  }
};

const HomePage: React.FC = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const openQuoteModal = () => {
    setShowQuoteModal(true);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
  };



  return (
    <div className="min-h-screen">
      <Hero
        backgroundImage={config.hero.backgroundImage}
        headline={config.hero.headline}
        subheadline=""
        ctaText={config.hero.ctaText}
        ctaLink={config.hero.ctaLink}
        header={config.header}
        onRequestQuote={openQuoteModal}
      />
      
      <div id="services">
        <ServicesGrid services={config.services} onRequestQuote={openQuoteModal} />
      </div>
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* Separator Line - Change 'border-orange-500' to any color you want */}
      <div className="w-full border-t-2 border-stone-600 my-0"></div>
      
      <Affiliates />

      <Contact header={config.header} footer={config.footer} />

      <QuoteModal isOpen={showQuoteModal} onClose={closeQuoteModal} />
      
      <Footer
        contactPhone={config.footer.contactPhone}
        location={config.footer.location}
        email={config.footer.email}
        quickLinks={config.footer.quickLinks}
        attribution={config.footer.attribution}
        onRequestQuote={openQuoteModal}
      />
    </div>
  );
};

// Configuration object for easy customization
const config = {
  header: {
    businessName: "JP's Mobile Detail",
    phone: '(702) 420-3151',
    location: 'Bullhead City, AZ',
    navLinks: [
      { name: 'Home', href: '#', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { name: 'Services', href: '#services', onClick: () => scrollToSection('services') },
      { name: 'Contact', href: '#', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
    ]
  },
  hero: {
    backgroundImage: '/auto_detailing/car3.png',
    headline: 'Premium Mobile Detailing',
    // subheadline: 'Premium Mobile Detailing',
    ctaText: 'Book Now',
    ctaLink: '/booking?detailer_id=joe123'
  },
  services: [
    {
      title: 'Auto Detailing',
      image: '/auto_detailing/sports.png',
      icon: <Car className="h-6 w-6" />
    },
    {
      title: 'Marine Detailing',
      image: '/boat_detailing/boat-detail5.png',
      icon: <Ship className="h-6 w-6" />
    },
    {
      title: 'RV Detailing',
      image: '/rv_detailing/rv-detail.png',
      icon: <Paintbrush className="h-6 w-6" />
    },
    {
      title: 'Interior / Exterior',
      image: '/interior_exterior/in-ex.png',
      icon: <Palette className="h-6 w-6" />
    },
    {
      title: 'Ceramic Coating',
      image: '/ceramic/ceramic.png',
      icon: <Sun className="h-6 w-6" />
    },
    {
      title: 'Paint Protection Film',
      image: '/ppf/ppf-car.png',
      icon: <Zap className="h-6 w-6" />
    }
  ],
  footer: {
    contactPhone: '(702) 420-3151',
    location: 'Bullhead City, AZ',
    email: 'service@jpsmobiledetail.com',
    quickLinks: [
      { name: 'Home', href: '#', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { name: 'Services', href: '#services', onClick: () => scrollToSection('services') },
      { name: 'Contact', href: '#', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
    ],
    attribution: {
      text: 'Powered by MobileDetailHub',
      link: 'https://mobiledetailhub.com'
    }
  }
};

export default HomePage;