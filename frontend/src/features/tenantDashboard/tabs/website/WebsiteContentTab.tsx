import React, { useEffect, useMemo,useState } from 'react';

import { useData } from '@/shared/hooks';
import { loadIndustryFAQs } from '@/shared/utils/faqLoader';
import { useAutoSave } from '@/shared/utils/useAutoSave';

import { getWebsiteContent, saveWebsiteContent } from '../../api/websiteContentApi';
import {
  FAQSection,
  GallerySection,
  HeroSection,
  ReviewsSection,
  ServicesSection
} from './components';
import { WebsiteContentProvider } from './contexts/WebsiteContentContext';

// Type definitions
interface GalleryImage {
  src: string;
  alt: string;
}

interface ServiceImage {
  slug: string;
  image: string;
  alt: string;
  title: string;
}

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

interface ContentData {
  hero_title: string;
  hero_subtitle: string;
  services_title: string;
  services_subtitle: string;
  services_auto_description: string;
  services_marine_description: string;
  services_rv_description: string;
  services_ceramic_description: string;
  services_correction_description: string;
  services_ppf_description: string;
  reviews_title: string;
  reviews_subtitle: string;
  reviews_avg_rating: number;
  reviews_total_count: number;
  faq_title: string;
  faq_subtitle: string;
  faq_content: FAQItem[];
  gallery_title?: string;
  gallery_description?: string;
  services?: {
    images?: ServiceImage[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface WebsiteContentTabProps {
  tenantSlug?: string;
}

const WebsiteContentTab: React.FC<WebsiteContentTabProps> = ({ tenantSlug }) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [customGalleryImages, setCustomGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load industry-specific FAQs
  const { industry } = useData();
  const [industryFAQs, setIndustryFAQs] = useState<Array<{ question: string; answer: string; category: string }>>([]);
  
  useEffect(() => {
    if (!industry) return;
    loadIndustryFAQs(industry)
      .then(setIndustryFAQs)
      .catch(() => {
        setIndustryFAQs([]);
      });
  }, [industry]);
  
  // Group FAQs by category
  const categoryFaqMap = useMemo(() => {
    const map: Record<string, typeof industryFAQs> = {};
    industryFAQs.forEach(faq => {
      if (!map[faq.category]) {
        map[faq.category] = [];
      }
      map[faq.category].push(faq);
    });
    return map;
  }, [industryFAQs]);
  
  // Memoize initial content data to prevent infinite re-renders
  const initialContentData = useMemo<ContentData>(() => ({
    hero_title: '',
    hero_subtitle: '',
    services_title: '',
    services_subtitle: '',
    services_auto_description: '',
    services_marine_description: '',
    services_rv_description: '',
    services_ceramic_description: '',
    services_correction_description: '',
    services_ppf_description: '',
    reviews_title: '',
    reviews_subtitle: '',
    reviews_avg_rating: 0,
    reviews_total_count: 0,
    faq_title: '',
    faq_subtitle: '',
    faq_content: []
  }), []);

  // Create save function that uses tenant slug
  const saveContentData = useMemo(() => {
    return async (data: ContentData) => {
      if (!tenantSlug) {
        throw new Error('No tenant selected');
      }

      // Clean up FAQ content - remove empty FAQs
      const cleanedFaqContent = data.faq_content.filter((faq: FAQItem) => 
        faq.question && faq.question.trim() !== '' && 
        faq.answer && faq.answer.trim() !== '' &&
        faq.category && faq.category.trim() !== ''
      );
      
      const cleanedData: ContentData = {
        ...data,
        faq_content: cleanedFaqContent
      };

      const result = await saveWebsiteContent(tenantSlug, cleanedData);
      
      return result;
    };
  }, [tenantSlug]);

  // Use auto-save hook
  const { value: contentData, setValue: setContentData } = useAutoSave(
    initialContentData,
    saveContentData,
    { debounce: 1000 }
  );

  // Load initial data from API
  useEffect(() => {
    const loadContentData = async () => {
      if (!tenantSlug) return;
      
      try {
        setIsLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- getWebsiteContent returns WebsiteContentData which matches ContentData
        const data = await getWebsiteContent(tenantSlug);
        setContentData(data as ContentData);
      } catch (error) {
        console.error('Failed to load website content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadContentData();
  }, [tenantSlug, setContentData]);

  const updateContent = (section: string, field: string, value: unknown) => {
    setContentData(prev => {
      // For flat structure (hero, reviews, faq, gallery), use direct field mapping
      if (section === 'hero') {
        const fieldMap: { [key: string]: keyof ContentData } = {
          'title': 'hero_title',
          'subtitle': 'hero_subtitle'
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      } else if (section === 'reviews') {
        const fieldMap: { [key: string]: keyof ContentData } = {
          'title': 'reviews_title',
          'subtitle': 'reviews_subtitle',
          'avg_rating': 'reviews_avg_rating',
          'total_count': 'reviews_total_count'
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      } else if (section === 'faq') {
        const fieldMap: { [key: string]: keyof ContentData } = {
          'title': 'faq_title',
          'subtitle': 'faq_subtitle',
          'content': 'faq_content'
        };
        const dbField = fieldMap[field];
        if (dbField) {
          return {
            ...prev,
            [dbField]: value
          };
        }
      }
      
      // Fallback to old nested structure for other sections
      const sectionKey = section as keyof ContentData;
      const existingSection = prev[sectionKey];
      const sectionValue = typeof existingSection === 'object' && existingSection !== null 
        ? { ...existingSection as Record<string, unknown>, [field]: value }
        : { [field]: value };
      
      return {
        ...prev,
        [section]: sectionValue
      } as ContentData;
    });
  };

  const resetToDefault = () => {
    // For FAQ section, load all default FAQs from utils
    const defaultFaqs = Object.values(categoryFaqMap).flat().map((faq: FAQItem) => ({
      category: faq.category,
      question: faq.question,
      answer: faq.answer
    }));
    
    const updatedContentData: ContentData = {
      ...contentData,
      faq_content: defaultFaqs
    };
    
    setContentData(updatedContentData);
  };

  // Function to load gallery images from gallery.json
  const loadGalleryImages = async () => {
    try {
      const response = await fetch('/mobile-detailing/data/gallery.json');
      const galleryData = (await response.json()) as GalleryImage[];
      setGalleryImages(galleryData);
    } catch {
      setGalleryImages([]);
    }
  };

  useEffect(() => {
    void loadGalleryImages();
  }, []);

  const handleAddCustomImage = () => {
    const newCustomImage = {
      src: '',
      alt: '',
    };
    setCustomGalleryImages(prev => [...prev, newCustomImage]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading website content...</p>
        </div>
      </div>
    );
  }

  if (!tenantSlug) {
    return <div className="text-red-500">Error: No tenant slug provided</div>;
  }

  return (
    <WebsiteContentProvider tenantSlug={tenantSlug}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Website Content</h2>
            <p className="text-gray-400 mt-1">Manage your website sections and content</p>
          </div>
        </div>

      {/* Content Sections Grid - Single Column */}
      <div className="grid grid-cols-1 gap-6">
          <HeroSection
            heroTitle={contentData.hero_title || ''}
            heroSubtitle={contentData.hero_subtitle || ''}
            heroImages={(contentData.services?.images as string[] | undefined) || []}
            onUpdateContent={(field, value) => { updateContent('hero', field, value); }}
          />

          <ServicesSection
            serviceImages={contentData.services?.images || []}
          />

          <ReviewsSection tenantSlug={tenantSlug} />

          <FAQSection
            faqContent={contentData.faq_content}
            onUpdateContent={(field, value) => { updateContent('faq', field, value); }}
            onResetToDefault={resetToDefault}
          />

          <GallerySection
            stockImages={galleryImages}
            customImages={customGalleryImages}
            onAddCustomImage={handleAddCustomImage}
          />
      </div>
      </div>
    </WebsiteContentProvider>
  );
};

export default WebsiteContentTab;
