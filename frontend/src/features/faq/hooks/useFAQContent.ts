import { useMemo } from 'react';
import { useWebsiteContent } from '@/shared/contexts/WebsiteContentContext';
import { useIndustrySiteData } from '@/shared/hooks/useIndustrySiteData';
import { MDH_FAQ_ITEMS } from '../utils';
import type { FAQItem as BaseFAQItem } from '../types';

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
  locationData?: any;
}

export const useFAQContent = (props?: UseFAQContentProps): UseFAQContentReturn => {
  // Get industry-specific site data
  const { siteData } = useIndustrySiteData();
  const locationData = props?.locationData;
  
  // Try to get website content, but handle cases where provider isn't available
  let websiteContent = null;
  try {
    const { content } = useWebsiteContent();
    websiteContent = content;
  } catch {
    // WebsiteContentProvider not available, use fallbacks
    websiteContent = null;
  }
  
  // Get FAQ title and subtitle from database or industry-specific fallbacks
  const faqTitle = websiteContent?.faq_title 
    ?? siteData?.faq?.title 
    ?? 'Frequently Asked Questions';
    
  const faqSubtitle = websiteContent?.faq_subtitle 
    ?? siteData?.faq?.subtitle 
    ?? locationData?.faqIntro 
    ?? 'Find answers to common questions about our mobile detailing services';
  
  // Get FAQ items from database or fallback to hardcoded utils
  const databaseFAQs: FAQItem[] = useMemo(() => {
    if (!websiteContent?.faq_content || !Array.isArray(websiteContent.faq_content)) {
      return [];
    }
    
    return websiteContent.faq_content.map((faq, index) => ({
      id: `db-${index}`,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      services: undefined // optional field
    } as FAQItem));
  }, [websiteContent?.faq_content]);
  
  // Convert location FAQs to FAQItem format if available
  const locationFAQs: FAQItem[] = useMemo(() => {
    if (!locationData?.faqs) return [];
    
    return locationData.faqs.map((faq: any, index: number) => ({
      id: `location-${index}`,
      question: faq.q,
      answer: faq.a,
      category: locationData.city ? locationData.city : 'Location'
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
    faqTitle,
    faqSubtitle,
    faqItems,
    categories
  };
};

