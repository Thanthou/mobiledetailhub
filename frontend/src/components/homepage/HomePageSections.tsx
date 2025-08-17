import React from 'react';
import Hero from '../hero/Hero';
import ServicesSection from './ServicesSection';
import FAQSection from './FAQSection';
import BrandsSection from './BrandsSection';
import ContactSection from './ContactSection';
import FooterSection from './FooterSection';

interface HomePageSectionsProps {
  currentBusiness: string;
  currentConfig: any;
  onBookNow: () => void;
  onRequestQuote: () => void;
}

const HomePageSections: React.FC<HomePageSectionsProps> = ({
  currentBusiness,
  currentConfig,
  onBookNow,
  onRequestQuote
}) => {
  return (
    <>
      {/* Hero Section */}
      <Hero
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
      />

      {/* Services Section */}
      <ServicesSection
        currentBusiness={currentBusiness}
        currentConfig={currentConfig}
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
      />

      {/* FAQ Section */}
      <FAQSection
        currentBusiness={currentBusiness}
        onRequestQuote={onRequestQuote}
      />

      {/* Brands Section */}
      <BrandsSection />

      {/* Contact Section */}
      <ContactSection
        currentBusiness={currentBusiness}
        onRequestQuote={onRequestQuote}
      />

      {/* Footer Section */}
      <FooterSection
        currentBusiness={currentBusiness}
        onRequestQuote={onRequestQuote}
      />
    </>
  );
};

export default HomePageSections;