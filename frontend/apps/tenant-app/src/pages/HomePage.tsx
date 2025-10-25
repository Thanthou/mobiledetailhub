import React, { useEffect } from 'react';

import { useFavicon, useSEO, useScrollSpy, useTenantSlug } from '@shared/hooks';
import { useData } from '@shared/hooks/useData';
import { setPageTitle } from '@shared/utils';

// Import tenant site components
import Header from '../components/header/components/Header';
import Hero from '../components/hero/components/Hero';
import ServicesGrid from '../components/services/components/ServicesGrid';
import Reviews from '../components/reviews/components/Reviews';
import { useReviewsAvailability } from '../components/reviews/hooks';
import FAQ from '../components/faq/components/FAQ';
import Gallery from '../components/gallery/components/Gallery';
import Footer from '../components/footer/components/Footer';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: unknown;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote }) => {
  // Resolve tenant slug (domain or params). If undefined, we are on platform main site.
  const tenantSlug = useTenantSlug();
  
  // Get tenant data for industry/branding
  const { industry, businessName } = useData();
  
  // Check if reviews are available
  const hasReviews = useReviewsAvailability();

  // Set industry-specific favicon
  useFavicon(industry);
  
  // Track scroll position for header navigation (conditionally include reviews)
  const scrollSpyIds = [
    'top', 
    'services', 
    'services-desktop', 
    ...(hasReviews ? ['reviews'] : []), 
    'faq', 
    'gallery', 
    'gallery-desktop', 
    'footer'
  ];
  
  useScrollSpy({
    ids: scrollSpyIds,
    headerPx: 88,
    threshold: 0.55,
    updateHash: false,
  });
  
  // Update page title with business name
  useEffect(() => {
    if (businessName && businessName !== 'Loading...') {
      setPageTitle(businessName);
    }
  }, [businessName]);

  // Update basic SEO for the platform page. Avoid heavy tenant-dependent hooks/components here.
  useSEO();

  // Render a lightweight marketing page for the main site to prevent blocking imports and cross-app coupling
  if (!tenantSlug) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-xl">That Smart Site</a>
            <nav className="space-x-4">
              <a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a>
              <a href="/login" className="text-gray-300 hover:text-white">Login</a>
              <a href="/onboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Get Started</a>
            </nav>
          </div>
        </header>

        <main className="pt-12 md:pt-20">
          <section className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Launch a Pro Website in Minutes</h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10">White‑label sites for local services: detailing, cleaning, lawn care, and more.</p>
            <a href="/onboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">Create Your Site</a>
          </section>

          <section className="container mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Templates</h3>
              <p className="text-gray-300">Conversion‑optimized layouts per industry.</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">SEO‑Ready</h3>
              <p className="text-gray-300">Structured data, fast loads, clean markup.</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">One‑Click Deploy</h3>
              <p className="text-gray-300">Automatic subdomain and CDN caching.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Render full tenant site with all components
  const handleRequestQuote = onRequestQuote || (() => { /* noop */ });
  
  return (
    <>
      <Header />
      <main className="snap-container overflow-y-scroll h-screen snap-y snap-mandatory scrollbar-hide">
        <Hero onRequestQuote={handleRequestQuote} />
        <ServicesGrid />
        {hasReviews && <Reviews />}
        <FAQ />
        
        {/* Gallery renders its own sections (mobile: separate Gallery + Footer, desktop: combined) */}
        <Gallery onRequestQuote={handleRequestQuote} />
        
        {/* Mobile-only Footer section */}
        <section 
          id="footer" 
          className="md:hidden relative snap-start snap-always bg-theme-background"
        >
          <div className="pt-[72px] py-12">
            <Footer onRequestQuote={handleRequestQuote} />
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;

