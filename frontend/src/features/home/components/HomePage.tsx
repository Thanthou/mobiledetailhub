import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePrefetch } from '@/shared/hooks';
import { FAQ } from '@/features/faq';
import { Footer } from '@/features/footer';
import { Hero } from '@/features/hero';
import { RequestQuoteModal } from '@/features/quotes';
import { Reviews } from '@/features/reviews';
import { Services } from '@/features/services';
import { useSiteContext } from '@/shared/hooks';

import HomePageLayout from './HomePageLayout';

const HomePage: React.FC = () => {
  const { isAffiliate, businessSlug } = useSiteContext();
  const { prefetchQuoteModal } = usePrefetch();
  const navigate = useNavigate();
  
  // Centralized modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Centralized modal handlers with prefetching
  const handleOpenQuoteModal = () => {
    if (isAffiliate) {
      setIsQuoteModalOpen(true);
    }
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const handleBookNow = () => {
    // Navigate to booking page, preserving business slug for affiliate sites
    const bookingPath = businessSlug ? `/${businessSlug}/booking` : '/booking';
    navigate(bookingPath);
  };

  // Prefetch handlers for better performance
  const handleQuoteModalPrefetch = () => {
    if (isAffiliate) {
      prefetchQuoteModal();
    }
  };
  
  return (
    <HomePageLayout>
      <section id="hero">
        <Hero 
          onRequestQuote={handleOpenQuoteModal} 
          onBookNow={handleBookNow}
          onQuoteHover={handleQuoteModalPrefetch}
        />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="reviews">
        <Reviews 
          reviewType={isAffiliate ? 'affiliate' : 'mdh'}
          businessSlug={businessSlug}
        />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="footer">
        <Footer 
          onRequestQuote={handleOpenQuoteModal} 
          onBookNow={handleBookNow}
          onQuoteHover={handleQuoteModalPrefetch}
        />
      </section>
      
      {/* Centralized Modals - Now using lazy loading */}
      {isAffiliate && (
        <RequestQuoteModal
          isOpen={isQuoteModalOpen}
          onClose={handleCloseQuoteModal}
        />
      )}
    </HomePageLayout>
  );
};

export default HomePage;
