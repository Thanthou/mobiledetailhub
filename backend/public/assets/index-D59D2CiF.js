import { k as assetsData } from './index-KDICy8u4.js';
import contentDefaults from './content-defaults-Df6c8CcD.js';
import seoDefaults from './seo-defaults-2tSsldvQ.js';
import './react-vendor-BgPOigzi.js';
import './vendor-CKIjew4F.js';
import './query-vendor-B2vaS9Wk.js';

function loadMobileDetailingConfig() {
  const heroImages = assetsData.hero.map((heroItem) => ({
    url: heroItem.desktop.url,
    mobileUrl: heroItem.mobile.url,
    alt: heroItem.alt,
    width: heroItem.desktop.width,
    height: heroItem.desktop.height,
    priority: heroItem.priority
  }));
  const config = {
    brand: "Mobile Detailing Hub",
    slug: "site",
    urlPath: "/",
    logo: {
      url: assetsData.logo.default.url,
      alt: assetsData.logo.default.alt,
      darkUrl: assetsData.logo.dark.url,
      lightUrl: assetsData.logo.light.url
    },
    seo: {
      title: seoDefaults.title,
      description: seoDefaults.description,
      keywords: seoDefaults.keywords.split(", "),
      canonicalPath: seoDefaults.canonicalPath,
      ogImage: seoDefaults.ogImage,
      twitterImage: seoDefaults.twitterImage,
      robots: seoDefaults.robots
    },
    hero: {
      h1: contentDefaults.hero.h1,
      sub: contentDefaults.hero.subTitle,
      Images: heroImages,
      // Note: Capital 'I' for compatibility with ImageCarousel component
      images: heroImages,
      // Lowercase for type compliance
      ctas: [
        { label: "Book Service", href: "/book" },
        { label: "Get Quote", href: "/quote" }
      ]
    },
    finder: {
      placeholder: "Enter your ZIP to check availability",
      sub: "Professional mobile detailing at your location"
    },
    servicesGrid: assetsData.services.grid.map((service) => {
      const thumbnail = assetsData.services.thumbnails[service.slug];
      return {
        slug: service.slug,
        title: service.title,
        image: thumbnail.url || "",
        alt: thumbnail.alt || service.title,
        href: service.href,
        width: thumbnail.width,
        height: thumbnail.height,
        priority: service.priority
      };
    }),
    reviews: {
      title: contentDefaults.reviews.title,
      subtitle: contentDefaults.reviews.subtitle,
      ratingValue: "4.9",
      reviewCount: 127,
      source: "Google"
    },
    faq: {
      title: contentDefaults.faq.title,
      subtitle: contentDefaults.faq.subtitle
    },
    contact: {
      email: "hello@thatsmartsite.com",
      phone: "(555) 123-4567"
    },
    socials: {
      facebook: "https://www.facebook.com/thatsmartsite",
      instagram: "https://www.instagram.com/thatsmartsite",
      googleBusiness: "https://share.google/mobiledetailing"
    }
  };
  return config;
}

export { loadMobileDetailingConfig };
//# sourceMappingURL=index-D59D2CiF.js.map
