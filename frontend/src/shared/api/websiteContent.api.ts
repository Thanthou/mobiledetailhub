// Website content API calls
import { apiService } from './api';

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface WebsiteContentData {
  hero_title?: string;
  hero_subtitle?: string;
  reviews_title?: string;
  reviews_subtitle?: string;
  reviews_avg_rating?: number;
  reviews_total_count?: number;
  faq_title?: string;
  faq_subtitle?: string;
  faq_content?: FAQItem[];
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteContentResponse {
  success: boolean;
  content?: WebsiteContentData;
  message?: string;
}

export const websiteContentApi = {
  // Get website content for a specific tenant
  getWebsiteContent: async (tenantSlug: string): Promise<WebsiteContentData> => {
    const response = await fetch(`/api/website-content/${tenantSlug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website content: ${response.statusText}`);
    }

    const data = await response.json() as WebsiteContentResponse;
    
    if (!data.success || !data.content) {
      throw new Error(data.message || 'Failed to fetch website content');
    }

    return data.content;
  },

  // Get website content for the main site (no tenant slug)
  getMainSiteContent: async (): Promise<WebsiteContentData> => {
    const response = await fetch('/api/website-content/main', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch main site content: ${response.statusText}`);
    }

    const data = await response.json() as WebsiteContentResponse;
    
    if (!data.success || !data.content) {
      throw new Error(data.message || 'Failed to fetch main site content');
    }

    return data.content;
  }
};
