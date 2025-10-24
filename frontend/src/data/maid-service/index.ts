/**
 * Maid Service Industry Config Loader
 * Assembles modular config files into MainSiteConfig structure
 */

import type { MainSiteConfig } from '@shared/types/location';

import assetsData from './assets.json';
import previewDefaults from './preview/defaults.json';
import seoDefaults from './seo-defaults.json';

/**
 * Load and assemble maid-service config from modular files
 */
export function loadMaidServiceConfig(): MainSiteConfig {
  console.log('Loading maid-service config...');
  console.log('Assets data:', assetsData);
  
  // Transform assets.json hero images to match MainSiteConfig format
  const heroImages = assetsData.hero.map(heroItem => ({
    url: heroItem.desktop.url,
    mobileUrl: heroItem.mobile.url,
    alt: heroItem.alt,
    width: heroItem.desktop.width,
    height: heroItem.desktop.height,
    priority: heroItem.priority
  }));
  
  console.log('Transformed hero images:', heroImages);

  // Assemble the full config
  const config: MainSiteConfig = {
    brand: 'Clean & Shine Maid Service',
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
      h1: previewDefaults.h1,
      sub: previewDefaults.subTitle,
      Images: heroImages,
      images: heroImages,
      ctas: [
        { label: 'Book Service', href: '/book' },
        { label: 'Get Quote', href: '/quote' }
      ]
    } as MainSiteConfig['hero'] & { Images: typeof heroImages },
    
    finder: {
      placeholder: 'Enter your ZIP to check availability',
      sub: 'Professional cleaning services in your area'
    },
    
    servicesGrid: assetsData.services.grid.map(service => {
      const thumbnail = assetsData.services.thumbnails[service.slug as keyof typeof assetsData.services.thumbnails];
      return {
        slug: service.slug,
        title: service.title,
        image: thumbnail?.url || '',
        alt: thumbnail?.alt || service.title,
        href: service.href,
        width: thumbnail?.width,
        height: thumbnail?.height,
        priority: service.priority
      };
    }),
    
    reviews: {
      title: previewDefaults.reviews_title,
      subtitle: previewDefaults.reviews_subtitle,
      ratingValue: '4.9',
      reviewCount: 85,
      source: 'Google'
    },
    
    faq: {
      title: previewDefaults.faq_title,
      subtitle: previewDefaults.faq_subtitle
    },
    
    contact: {
      email: 'hello@thatsmartsite.com',
      phone: '(555) 123-4567'
    },
    
    socials: {
      facebook: 'https://www.facebook.com/thatsmartsite',
      instagram: 'https://www.instagram.com/thatsmartsite',
      googleBusiness: 'https://share.google/maidservice'
    }
  };

  return config;
}

