/**
 * Main Marketing Site Config Loader
 * Assembles JSON config for Tenant-0 (thatsmartsite.com)
 * 
 * KISS: Single defaults.json file with all content
 */

import type { MainSiteConfig } from '@shared/types/location';

import assetsData from './assets.json';
import defaultsData from './defaults.json';
import seoData from './seo.json';

/**
 * Load marketing site config (Tenant-0)
 * Uses simplified flat JSON structure
 */
export function loadMainSiteConfig(): MainSiteConfig {
  // Transform hero images
  const heroImages = assetsData.hero.map(heroItem => ({
    url: heroItem.desktop.url,
    mobileUrl: heroItem.mobile.url,
    alt: heroItem.alt,
    width: heroItem.desktop.width,
    height: heroItem.desktop.height,
    priority: heroItem.priority
  }));

  const config: MainSiteConfig = {
    brand: 'That Smart Site',
    slug: 'main',
    urlPath: '/',
    
    logo: {
      url: assetsData.logo.default.url,
      alt: assetsData.logo.default.alt,
      darkUrl: assetsData.logo.dark.url,
      lightUrl: assetsData.logo.light.url
    },
    
    seo: {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords.split(', '),
      canonicalPath: seoData.canonicalPath,
      ogImage: seoData.ogImage,
      twitterImage: seoData.twitterImage,
      robots: seoData.robots
    },
    
    hero: {
      h1: defaultsData.h1,
      sub: defaultsData.subTitle,
      Images: heroImages,
      images: heroImages,
      ctas: [
        { label: 'Create Your Site', href: '/onboard' },
        { label: 'View Pricing', href: '/pricing' }
      ]
    } as MainSiteConfig['hero'] & { Images: typeof heroImages },
    
    finder: {
      placeholder: 'Enter your industry to get started',
      sub: 'Professional websites for any local service business'
    },
    
    servicesGrid: [],
    
    reviews: {
      title: defaultsData.reviews_title,
      subtitle: defaultsData.reviews_subtitle,
      ratingValue: defaultsData.reviews_average.toString(),
      reviewCount: defaultsData.reviews_total,
      source: 'Platform'
    },
    
    faq: {
      title: defaultsData.faq_title,
      subtitle: defaultsData.faq_subtitle
    },
    
    footer: {
      tagline: 'Professional websites for local service businesses',
      copyright: `© ${new Date().getFullYear()} That Smart Site. All rights reserved.`
    }
  };

  return config;
}

