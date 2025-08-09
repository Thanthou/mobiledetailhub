import React, { useState } from 'react';
import { Car, Paintbrush, Palette, Sun, Zap, Ship } from 'lucide-react';
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import Contact from './Contact';
import Affiliates from './Affiliates';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import FAQ from './FAQ';
import { businessConfig } from '../config/sharedConfig';

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
  const faqRef = React.useRef<{ expand: () => void }>(null);

  const scrollToFAQ = () => {
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      const elementPosition = faqSection.offsetTop;
      const offset = 80; // Additional scroll down
      window.scrollTo({ top: elementPosition + offset, behavior: 'smooth' });
      
      // Auto-expand the FAQ after scrolling
      setTimeout(() => {
        faqRef.current?.expand();
      }, 500); // Small delay to ensure scroll is complete
    }
  };

  const openQuoteModal = () => {
    setShowQuoteModal(true);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
  };

  const handleBookNow = () => {
    if (businessConfig.bookingEnabled) {
      window.location.href = businessConfig.bookingLink;
    }
    // If booking disabled, do nothing (no action)
  };

  // Configuration object for easy customization
  const config = {
    header: {
      businessName: businessConfig.name,
      phone: businessConfig.phone,
      location: businessConfig.location,
      navLinks: [
        { name: 'Home', href: '#', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Services', href: '#services', onClick: () => scrollToSection('services') },
        { name: 'FAQ', href: '#faq', onClick: () => scrollToFAQ() },
        { name: 'Contact', href: '#', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
      ]
    },
    socialMedia: businessConfig.socialMedia,
    hero: {
      backgroundImage: businessConfig.hero.backgroundImage,
      headline: businessConfig.hero.headline,
      // subheadline: 'Premium Mobile Detailing',
      ctaText: businessConfig.hero.ctaText,
      ctaLink: businessConfig.bookingLink
    },
    services: [
      {
        title: 'Auto Detailing',
        image: '/auto_detailing/service_image.png',
        icon: <Car className="h-6 w-6" />
      },
      {
        title: 'Marine Detailing',
        image: '/boat_detailing/service_image.png',
        icon: <Ship className="h-6 w-6" />
      },
      {
        title: 'RV Detailing',
        image: '/rv_detailing/service_image.png',
        icon: <Paintbrush className="h-6 w-6" />
      },
      {
        title: 'Interior / Exterior',
        image: '/interior_exterior/service_image.png',
        icon: <Palette className="h-6 w-6" />
      },
      {
        title: 'Ceramic Coating',
        image: '/ceramic/service_image.png',
        icon: <Sun className="h-6 w-6" />
      },
      {
        title: 'Paint Protection Film',
        image: '/ppf/service_image.png',
        icon: <Zap className="h-6 w-6" />
      }
    ],
    footer: {
      contactPhone: businessConfig.phone,
      location: businessConfig.location,
      email: businessConfig.email,
      quickLinks: [
        { name: 'Home', href: '#', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Services', href: '#services', onClick: () => scrollToSection('services') },
        { name: 'FAQ', href: '#faq', onClick: () => scrollToFAQ() },
        { name: 'Contact', href: '#', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
      ],
      attribution: businessConfig.attribution
    }
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
          socialLinks={config.socialMedia}
          onBookNow={handleBookNow}
          onRequestQuote={openQuoteModal}
        />
      
      <div id="services">
        <ServicesGrid services={config.services} onBookNow={handleBookNow} onRequestQuote={openQuoteModal} />
      </div>
      
      {/* FAQ Section */}
      <FAQ ref={faqRef} onRequestQuote={openQuoteModal} />
      
      {/* Separator Line - Change 'border-orange-500' to any color you want */}
      <div className="w-full border-t-2 border-stone-600 my-0"></div>
      
      <Affiliates />

      <Contact header={config.header} footer={config.footer} serviceLocations={businessConfig.serviceLocations} onRequestQuote={openQuoteModal} />

      <QuoteModal isOpen={showQuoteModal} onClose={closeQuoteModal} />
      
            <Footer 
        contactPhone={config.footer.contactPhone}
        location={config.footer.location}
        email={config.footer.email}
        quickLinks={config.footer.quickLinks}
        attribution={config.footer.attribution}
        socialLinks={config.socialMedia}
        onBookNow={handleBookNow}
        onRequestQuote={openQuoteModal}
      />
    </div>
  );
};

export default HomePage;