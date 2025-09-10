import { useState } from 'react';

import { BookingModal,LazyQuoteModal, prefetchQuoteModal } from '../../components/Book_Quote';
import { useSiteContext } from '../../hooks/useSiteContext';
import Hero from './components/02_hero';
import Services from './components/03_services/Services';
import * as Reviews from './components/04_reviews';
import FAQ from './components/05_faq';
import Footer from './components/06_footer';

const HomePage = () => {
  const { isAffiliate } = useSiteContext();
  
  // Centralized modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Centralized modal handlers with prefetching
  const handleOpenQuoteModal = () => {
    if (isAffiliate) {
      setIsQuoteModalOpen(true);
    }
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

  // Prefetch handlers for better performance
  const handleQuoteModalPrefetch = () => {
    if (isAffiliate) {
      void prefetchQuoteModal();
    }
  };
  
  return (
    <div>
      <div id="top"></div>
      <section id="hero">
        <Hero 
          onRequestQuote={handleOpenQuoteModal} 
          onBookNow={handleOpenBookingModal}
          onQuoteHover={handleQuoteModalPrefetch}
        />
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
        <Footer 
          onRequestQuote={handleOpenQuoteModal} 
          onBookNow={handleOpenBookingModal}
          onQuoteHover={handleQuoteModalPrefetch}
        />
      </section>
      
      {/* Centralized Modals - Now using lazy loading */}
      {isAffiliate && (
        <LazyQuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={handleCloseQuoteModal} 
        />
      )}
      {/* Note: BookingModal remains eager loaded for now - can be made lazy if needed */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={handleCloseBookingModal} 
      />
    </div>
  );
};

export default HomePage;
