/**
 * Mobile Detailing Industry Config Loader
 * Assembles modular config files into MainSiteConfig structure
 */

import type { MainSiteConfig } from '@/shared/types/location';
import assetsData from './assets.json';
import contentDefaults from './content-defaults.json';
import seoDefaults from './seo-defaults.json';

/**
 * Load and assemble mobile-detailing config from modular files
 * This replaces the legacy site.json approach
 */
export async function loadMobileDetailingConfig(): Promise<MainSiteConfig> {
  // Transform assets.json hero images to match MainSiteConfig format
  const heroImages = assetsData.hero.map(heroItem => ({
    url: heroItem.desktop.url,
    mobileUrl: heroItem.mobile.url,
    alt: heroItem.alt,
    width: heroItem.desktop.width,
    height: heroItem.desktop.height,
    priority: heroItem.priority
  }));

  // Assemble the full config
  const config: MainSiteConfig = {
    brand: 'Mobile Detailing Hub',
    slug: 'site',
    urlPath: '/',
    
    logo: {
      url: assetsData.logo.default.url,
      alt: assetsData.logo.default.alt,
      darkUrl: assetsData.logo.dark.url,
      lightUrl: assetsData.logo.light.url
    },
    
    seo: {
      title: seoDefaults.title,
      description: seoDefaults.description,
      keywords: seoDefaults.keywords.split(', '),
      canonicalPath: seoDefaults.canonicalPath,
      ogImage: seoDefaults.ogImage,
      twitterImage: seoDefaults.twitterImage,
      robots: seoDefaults.robots
    },
    
    hero: {
      h1: contentDefaults.hero.h1,
      sub: contentDefaults.hero.subTitle,
      Images: heroImages, // Note: Capital 'I' for compatibility with ImageCarousel component
      images: heroImages, // Lowercase for type compliance
      ctas: [
        { label: 'Book Service', href: '/book' },
        { label: 'Get Quote', href: '/quote' }
      ]
    } as MainSiteConfig['hero'] & { Images: typeof heroImages },
    
    finder: {
      placeholder: 'Enter your ZIP to check availability',
      sub: 'Professional mobile detailing at your location'
    },
    
    servicesGrid: assetsData.services.grid.map(service => ({
      slug: service.slug,
      title: service.title,
      image: assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails]?.url || '',
      alt: assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails]?.alt || service.title,
      href: service.href,
      width: assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails]?.width,
      height: assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails]?.height,
      priority: service.priority
    })),
    
    reviews: {
      title: contentDefaults.reviews.title,
      subtitle: contentDefaults.reviews.subtitle,
      ratingValue: '4.9',
      reviewCount: 127,
      source: 'Google'
    },
    
    faq: {
      title: contentDefaults.faq.title,
      subtitle: contentDefaults.faq.subtitle
    },
    
    contact: {
      email: 'service@mobiledetailhub.com',
      phone: '(555) 123-4567'
    },
    
    socials: {
      facebook: 'https://www.facebook.com/mobiledetailhub',
      instagram: 'https://www.instagram.com/mobiledetailhub',
      googleBusiness: 'https://share.google/mobiledetailing'
    }
  };

  return config;
}

