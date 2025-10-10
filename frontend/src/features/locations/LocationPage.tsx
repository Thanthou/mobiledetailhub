import { useEffect } from "react";

// Page-level composition - intentionally imports from multiple features
// This is a top-level page that composes multiple feature components
// eslint-disable-next-line no-restricted-imports -- Page composition
import { FAQ } from '@/features/faq';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Footer } from '@/features/footer';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Hero } from '@/features/hero';
import { useLocationPageState } from '@/features/locations/hooks';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { RequestQuoteModal } from '@/features/quotes';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Reviews } from '@/features/reviews';
// eslint-disable-next-line no-restricted-imports -- Page composition
import { Services } from '@/features/services';
import HomePageLayout from '@/shared/components/HomePageLayout';
import type { LocationPage as LocationPageType } from '@/shared/types/location';
import { getAbsoluteUrl } from '@/shared/utils';
import { generateAllSchemas, injectAllSchemas } from '@/shared/utils/schemaUtils';

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

  // Update SEO meta tags on mount
  useEffect(() => {
    // canonical
    const canonical = document.getElementById("canonical-link") as HTMLLinkElement | null;
    if (canonical) canonical.href = `https://mobiledetailhub.com${area.seo.canonicalPath}`;

    // title
    const title = area.seo.title;
    document.title = title;

    // meta description
    const descTag = document.getElementById("meta-desc") as HTMLMetaElement | null;
    if (descTag) descTag.setAttribute("content", area.seo.description);

    // OG/Twitter images
    const ogImage = document.getElementById("og-image") as HTMLMetaElement | null;
    const twImage = document.getElementById("tw-image") as HTMLMetaElement | null;
    const ogImg = area.seo.ogImage ?? area.images?.[0]?.url;
    const twImg = area.seo.twitterImage ?? ogImg;
    const absoluteOgImg = ogImg ? getAbsoluteUrl(ogImg) : '';
    const absoluteTwImg = twImg ? getAbsoluteUrl(twImg) : '';
    if (absoluteOgImg && ogImage) ogImage.setAttribute("content", absoluteOgImg);
    if (absoluteTwImg && twImage) twImage.setAttribute("content", absoluteTwImg);

    // Generate and inject all Schema.org JSON-LD schemas dynamically
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
