import { useEffect } from "react";

// Page-level composition - intentionally imports from multiple features
// This is a top-level page that composes multiple feature components
// eslint-disable-next-line no-restricted-imports -- Page composition
import { FAQ } from '@main/components/faq';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Footer } from '@main/components/footer';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Hero } from '@main/components/hero';
import { useLocationPageState } from '@main/components/locations/hooks';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { RequestQuoteModal } from '@main/components/quotes';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Reviews } from '@main/components/reviews';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Services } from '@main/components/services';
import HomePageLayout from '@shared/components/HomePageLayout';
import { useBrowserTab, useMetaTags } from '@shared/hooks';
import type { LocationPage as LocationPageType } from '@shared/types/location';
import { generateAllSchemas, injectAllSchemas } from '@shared/utils/schemaUtils';

// Page-level composition - allowed to import from multiple features
export default function LocationPage({ area }: { area: LocationPageType }) {  
  const locationPageState = useLocationPageState();
  const {
    isAffiliate,
    businessSlug,
    isQuoteModalOpen,
    handleOpenQuoteModal,
    handleCloseQuoteModal,
    handleBookNow,
    handleQuoteModalPrefetch
  } = locationPageState;

  // Update browser tab title
  useBrowserTab({
    title: area.seo.title,
    useBusinessName: false, // Location pages have their own title
  });

  // Update meta tags for SEO
  useMetaTags({
    title: area.seo.title,
    description: area.seo.description,
    ogImage: area.seo.ogImage ?? area.images?.[0]?.url,
    twitterImage: area.seo.twitterImage ?? area.seo.ogImage ?? area.images?.[0]?.url,
    canonicalPath: area.seo.canonicalPath,
  });

  // Generate and inject Schema.org JSON-LD schemas
  useEffect(() => {
    const schemas = generateAllSchemas(area, 'location');
    injectAllSchemas(schemas);
  }, [area]);

  return (
    <HomePageLayout>
      <section id="hero">
        <Hero 
          onRequestQuote={handleOpenQuoteModal} 
          onBookNow={handleBookNow}
          onQuoteHover={handleQuoteModalPrefetch}
          {...(area.hero.h1 || area.hero.sub ? {
            customContent: {
              title: area.hero.h1,
              ...(area.hero.sub && { subtitle: area.hero.sub })
            }
          } : {})}
        />
      </section>

      <section id="services">
        <Services />
      </section>
      <section id="reviews">
        <Reviews 
          tenantSlug={businessSlug}
          {...(area.reviewsSection?.heading && { customHeading: area.reviewsSection.heading })}
          {...(area.reviewsSection?.intro && { customIntro: area.reviewsSection.intro })}
          {...(area.reviewsSection?.feedKey && { feedKey: area.reviewsSection.feedKey })}
        />
      </section>
      <FAQ 
        {...(area.faqs && { customFAQs: area.faqs })}
        {...(area.faqIntro && { customFAQIntro: area.faqIntro })}
      />
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
}
