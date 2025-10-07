import { useEffect } from "react";

import { FAQ } from '@/features/faq';
import { Footer } from '@/features/footer';
import { Hero } from '@/features/hero';
import { RequestQuoteModal } from '@/features/quotes';
import { Reviews } from '@/features/reviews';
import { Services } from '@/features/services';

import { useHomePageState } from '@/features/home/hooks';
import HomePageLayout from '@/features/home/components/HomePageLayout';
import { getAbsoluteUrl } from '@/shared/utils';
import { generateAllSchemas, injectAllSchemas } from '@/shared/utils/schemaUtils';

type AreaImage = { 
  url: string; 
  alt: string; 
  caption?: string; 
  role?: "hero" | "gallery" 
};

type Area = {
  slug: string;
  city: string;
  stateCode: string;
  state?: string;
  urlPath: string;
  affiliate?: string;
  headings?: { h1?: string; sub?: string };
  intro?: string;
  images?: AreaImage[];
  faqs?: Array<{ q: string; a: string }>;
  "faq-intro"?: string;
  reviewsSection?: {
    heading?: string;
    intro?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
};

export default function LocationPage({ area }: { area: Area }) {
  console.log('LocationPage rendered with area:', area);
  
  const {
    isAffiliate,
    businessSlug,
    isQuoteModalOpen,
    handleOpenQuoteModal,
    handleCloseQuoteModal,
    handleBookNow,
    handleQuoteModalPrefetch
  } = useHomePageState();

  // Update SEO meta tags on mount
  useEffect(() => {
    // canonical
    const canonical = document.getElementById("canonical-link") as HTMLLinkElement | null;
    if (canonical) canonical.href = `https://mobiledetailhub.com${area.seo?.canonicalPath || area.urlPath}`;

    // title
    const title = area?.seo?.title ?? `Mobile Detailing ${area.city}, ${area.stateCode}`;
    document.title = title;

    // meta description
    const descTag = document.getElementById("meta-desc") as HTMLMetaElement | null;
    if (descTag && area?.seo?.description) descTag.setAttribute("content", area.seo.description);

    // OG/Twitter images
    const ogImage = document.getElementById("og-image") as HTMLMetaElement | null;
    const twImage = document.getElementById("tw-image") as HTMLMetaElement | null;
    const ogImg = area?.seo?.ogImage ?? area.images?.[0]?.url;
    const twImg = area?.seo?.twitterImage ?? ogImg;
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
          {...(area.headings?.h1 || area.headings?.sub ? {
            customContent: {
              ...(area.headings?.h1 && { title: area.headings.h1 }),
              ...(area.headings?.sub && { subtitle: area.headings.sub })
            }
          } : {})}
        />
      </section>

      <section id="services">
        <Services />
      </section>
      <section id="reviews">
        <Reviews 
          tenantSlug={businessSlug ?? ''}
          {...(area["reviewsSection"]?.heading && { customHeading: area["reviewsSection"].heading })}
          {...(area["reviewsSection"]?.intro && { customIntro: area["reviewsSection"].intro })}
          {...(area["reviewsSection"]?.feedKey && { feedKey: area["reviewsSection"].feedKey })}
        />
      </section>
      <FAQ 
        {...(area.faqs && { customFAQs: area.faqs })}
        {...(area["faq-intro"] && { customFAQIntro: area["faq-intro"] })}
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
