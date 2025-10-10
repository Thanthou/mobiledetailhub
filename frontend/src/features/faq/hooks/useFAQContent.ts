import { useMemo } from 'react';

import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';

import type { FAQItem as BaseFAQItem } from '../types';
import { MDH_FAQ_ITEMS } from '../utils';

// Extended FAQ Item that allows any category string
export interface FAQItem extends Omit<BaseFAQItem, 'category'> {
  category: string;
}

interface UseFAQContentReturn {
  faqTitle: string;
  faqSubtitle: string;
  faqItems: FAQItem[];
  categories: string[];
}

interface UseFAQContentProps {
  locationData?: {
    faqIntro?: string;
    city?: string;
    faqs?: Array<{ q: string; a: string }>;
  };
}

export const useFAQContent = (props?: UseFAQContentProps): UseFAQContentReturn => {
  // Get industry-specific site data
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- siteData is dynamically imported JSON
  const { siteData } = useIndustrySiteData();
  const locationData = props?.locationData;
  
  // Get website content - hooks must be called unconditionally
  const { content: websiteContent } = useWebsiteContent();
  
  // Get FAQ title and subtitle from database or industry-specific fallbacks
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- siteData is dynamically imported JSON
  const faqTitle = websiteContent?.faq_title 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- siteData is dynamically imported JSON
    ?? siteData?.faq?.title 
    ?? 'Frequently Asked Questions';
    
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- siteData is dynamically imported JSON
  const faqSubtitle = websiteContent?.faq_subtitle 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- siteData is dynamically imported JSON
    ?? siteData?.faq?.subtitle 
    ?? locationData?.faqIntro 
    ?? 'Find answers to common questions about our mobile detailing services';
  
  // Get FAQ items from database or fallback to hardcoded utils
  const databaseFAQs: FAQItem[] = useMemo(() => {
    if (!websiteContent?.faq_content || !Array.isArray(websiteContent.faq_content)) {
      return [];
    }
    
    return websiteContent.faq_content.map((faq, index) => ({
      id: `db-${String(index)}`,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      question: String(faq.question ?? ''),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      answer: String(faq.answer ?? ''),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- faq properties from database might be null
      category: String(faq.category ?? 'General'),
      services: undefined // optional field
    } as FAQItem));
  }, [websiteContent?.faq_content]);
  
  // Convert location FAQs to FAQItem format if available
  const locationFAQs: FAQItem[] = useMemo(() => {
    if (!locationData?.faqs) return [];
    
    return locationData.faqs.map((faq, index) => ({
      id: `location-${String(index)}`,
      question: faq.q,
      answer: faq.a,
      category: locationData.city ?? 'Location'
    }));
  }, [locationData]);
  
  // Priority: Database FAQs ONLY (don't mix with hardcoded)
  // If database has FAQs, use ONLY those + location FAQs
  // Otherwise, fall back to hardcoded FAQs + location FAQs
  const faqItems = useMemo(() => {
    if (databaseFAQs.length > 0) {
      // Use ONLY database FAQs (don't add hardcoded ones)
      return [...databaseFAQs, ...locationFAQs];
    }
    // Fallback to hardcoded FAQs only if no database FAQs
    return [...MDH_FAQ_ITEMS, ...locationFAQs];
  }, [databaseFAQs, locationFAQs]);
  
  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(faqItems.map(faq => faq.category)));
    return ['All', ...uniqueCategories];
  }, [faqItems]);

  return {
    faqTitle: String(faqTitle),
    faqSubtitle: String(faqSubtitle),
    faqItems,
    categories
  };
};

