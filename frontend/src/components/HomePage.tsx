import { useState } from 'react';
import Hero from './02_hero';
import Services from './03_services/Services';
import * as Reviews from './04_reviews';
import FAQ from './05_faq';
import Footer from './07_footer';
import { QuoteModal, BookingModal } from './Book_Quote';
import { useSiteContext } from '../hooks/useSiteContext';

const HomePage = () => {
  const { isAffiliate } = useSiteContext();
  
  // Centralized modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Centralized modal handlers
  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };
  
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };
  
  return (
    <div>
      <div id="top"></div>
      <section id="hero">
        <Hero onRequestQuote={handleOpenQuoteModal} onBookNow={handleOpenBookingModal} />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="reviews">
        {isAffiliate ? <Reviews.ReviewsAffiliate /> : <Reviews.ReviewsMDH />}
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="footer">
        <Footer onRequestQuote={handleOpenQuoteModal} onBookNow={handleOpenBookingModal} />
      </section>
      
      {/* Centralized Modals */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={handleCloseQuoteModal} 
      />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={handleCloseBookingModal} 
      />
    </div>
  );
};

export default HomePage;
