import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Image, Star, HelpCircle, BarChart3, Eye, ChevronDown, ChevronRight, Edit3, Check, Save, Plus, X } from 'lucide-react';
import { useAutoSave } from '@/shared/utils/useAutoSave';
import { saveWebsiteContent, getWebsiteContent, type WebsiteContentData } from '../../api/websiteContentApi';
import { ReviewsContent, AddReviewForm, RemoveReviewTab } from './components';
import { WebsiteAutoSaveField } from './components/WebsiteAutoSaveField';
import { FAQItemAutoSaveField } from './components/FAQItemAutoSaveField';
import { useWebsiteContentData } from './hooks/useWebsiteContentData';
import { WebsiteContentProvider } from './contexts/WebsiteContentContext';
import {
  MDH_FAQ_SERVICES,
  MDH_FAQ_PRICING,
  MDH_FAQ_SCHEDULING,
  MDH_FAQ_LOCATIONS,
  MDH_FAQ_PREPARATION,
  MDH_FAQ_PAYMENTS,
  MDH_FAQ_WARRANTY,
  MDH_FAQ_AFTERCARE,
  MDH_FAQ_GENERAL
} from '@/features/faq/utils';

interface WebsiteContentTabProps {
  tenantSlug?: string;
}

const WebsiteContentTab: React.FC<WebsiteContentTabProps> = ({ tenantSlug }) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedServiceImages, setSelectedServiceImages] = useState<number[]>([]);
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set(['hero', 'services', 'reviews', 'faq', 'gallery']));
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [customGalleryImages, setCustomGalleryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlySaved, setRecentlySaved] = useState<Set<string>>(new Set());
  const [activeReviewsTab, setActiveReviewsTab] = useState<'content' | 'add-review' | 'remove-review'>('content');
  const [activeHeroTab, setActiveHeroTab] = useState<'content' | 'images'>('content');
  const [activeFaqTab, setActiveFaqTab] = useState<'content' | 'categories'>('content');
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('Services');
  const [activeGalleryTab, setActiveGalleryTab] = useState<'stock' | 'custom'>('stock');
  
  // FAQ Categories for sub-tabs
  const faqCategories = [
    'Services',
    'Pricing', 
    'Scheduling',
    'Locations',
    'Preparation',
    'Payments',
    'Warranty',
    'Aftercare',
    'General'
  ];

  // Map categories to their FAQ data
  const categoryFaqMap = useMemo(() => ({
    'Services': MDH_FAQ_SERVICES,
    'Pricing': MDH_FAQ_PRICING,
    'Scheduling': MDH_FAQ_SCHEDULING,
    'Locations': MDH_FAQ_LOCATIONS,
    'Preparation': MDH_FAQ_PREPARATION,
    'Payments': MDH_FAQ_PAYMENTS,
    'Warranty': MDH_FAQ_WARRANTY,
    'Aftercare': MDH_FAQ_AFTERCARE,
    'General': MDH_FAQ_GENERAL
  }), []);

  
  // Memoize initial content data to prevent infinite re-renders
  // Use FLAT structure matching the database schema
  const initialContentData = useMemo(() => ({
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
    return async (data: any) => {
      if (!tenantSlug) {
        throw new Error('No tenant selected');
      }


      // Clean up FAQ content - remove empty FAQs
      const cleanedFaqContent = (data.faq_content || []).filter((faq: any) => 
        faq.question && faq.question.trim() && 
        faq.answer && faq.answer.trim() &&
        faq.category && faq.category.trim()
      );
      
      const cleanedData = {
        ...data,
        faq_content: cleanedFaqContent
      };


      const result = await saveWebsiteContent(tenantSlug, cleanedData);
      
      
      // Show visual feedback for all fields that were just saved
      const allFields = ['hero_title', 'hero_subtitle', 'reviews_title', 'reviews_subtitle', 'faq_title', 'faq_subtitle'];
      setRecentlySaved(new Set(allFields));
      
      // Clear the visual feedback after 2 seconds
      setTimeout(() => {
        setRecentlySaved(new Set());
      }, 2000);
      
      return result;
    };
  }, [tenantSlug]);

  // Use auto-save hook
  const { value: contentData, setValue: setContentData, isSaving, error: saveError } = useAutoSave(
    initialContentData,
    saveContentData,
    { debounce: 1000 }
  );

  // Transform API data - backend returns flat structure, just pass through
  const transformApiData = (apiData: any) => {
    // Backend returns flat structure matching our initialContentData
    // Just return as-is
    return apiData;
  };

  // Load initial data from API
  useEffect(() => {
    const loadContentData = async () => {
      if (!tenantSlug) return;
      
      try {
        setIsLoading(true);
        const data = await getWebsiteContent(tenantSlug);
        const transformedData = transformApiData(data);
        setContentData(transformedData);
      } catch (error) {
        console.error('Failed to load website content:', error);
        // Keep using initial data if API fails
      } finally {
        setIsLoading(false);
      }
    };

    loadContentData();
  }, [tenantSlug, setContentData]);



  const updateContent = (section: string, field: string, value: any) => {
    setContentData(prev => {
      // For flat structure (hero, reviews, faq, gallery), use direct field mapping
      if (section === 'hero') {
        const fieldMap: { [key: string]: string } = {
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
        const fieldMap: { [key: string]: string } = {
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
        const fieldMap: { [key: string]: string } = {
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
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      };
    });
  };

  const isFieldRecentlySaved = (section: string, field: string) => {
    return recentlySaved.has(`${section}.${field}`);
  };

  const resetToDefault = () => {
    // For FAQ section, load all default FAQs from utils
    const defaultFaqs = Object.values(categoryFaqMap).flat().map((faq: any) => ({
      category: faq.category,
      question: faq.question,
      answer: faq.answer
    }));
    
    // Update just the FAQ section with default content (flat structure)
    const updatedContentData = {
      ...contentData,
      faq_content: defaultFaqs
    };
    
    setContentData(updatedContentData);
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleServiceImageSelection = (index: number) => {
    setSelectedServiceImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleCardCollapse = (cardId: string) => {
    setCollapsedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Function to load gallery images from gallery.json
  const loadGalleryImages = async () => {
    try {
      // Load gallery images from the public gallery.json file
      const response = await fetch('/mobile-detailing/data/gallery.json');
      const galleryData = await response.json();
      
      // Store the full gallery data (not just URLs) for access to alt text
      setGalleryImages(galleryData);
    } catch (error) {
      setGalleryImages([]);
    }
  };

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const contentSections = [
    {
      id: 'hero',
      title: 'Hero',
      icon: Image,
      data: {
        title: contentData.hero_title || '',
        subtitle: contentData.hero_subtitle || ''
      }
    },
    {
      id: 'services',
      title: 'Services',
      icon: BarChart3,
      data: contentData.services || {}
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: Star,
      data: {
        title: contentData.reviews_title || '',
        subtitle: contentData.reviews_subtitle || '',
        avg_rating: contentData.reviews_avg_rating || 0,
        total_count: contentData.reviews_total_count || 0
      }
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      data: {
        title: contentData.faq_title || '',
        subtitle: contentData.faq_subtitle || '',
        content: contentData.faq_content || []
      }
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: Image,
      data: {
        title: contentData.gallery_title || '',
        description: contentData.gallery_description || '',
        stockImages: galleryImages,
        customImages: customGalleryImages 
      }
    }
  ];

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
        {contentSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-stone-800 rounded-lg p-6 border border-stone-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-orange-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveCard(activeCard === section.id ? null : section.id)}
                    className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={resetToDefault}
                    className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Default
                  </button>
                  <button
                    onClick={() => toggleCardCollapse(section.id)}
                    className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {collapsedCards.has(section.id) ? (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {collapsedCards.has(section.id) ? 'Expand' : 'Collapse'}
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {!collapsedCards.has(section.id) && (
                <div className="space-y-4">
                {section.id === 'hero' && (
                  <div className="space-y-4">
                    {/* Hero Sub-tabs */}
                    <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
                      <button
                        onClick={() => setActiveHeroTab('content')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeHeroTab === 'content'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Content
                      </button>
                      <button
                        onClick={() => setActiveHeroTab('images')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeHeroTab === 'images'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Images
                      </button>
                    </div>

                    {/* Hero Sub-tab Content */}
                    <div className="transition-all duration-300 ease-in-out">
                      {activeHeroTab === 'content' && (
                  <div className="space-y-4">
                    <div className="w-2/5">
                      <WebsiteAutoSaveField
                        field="hero_title"
                        label="Hero Title"
                        placeholder="Enter hero title"
                      />
                    </div>
                    <div className="w-2/5">
                      <WebsiteAutoSaveField
                        field="hero_subtitle"
                        label="Hero Subtitle"
                        placeholder="Enter hero subtitle"
                      />
                    </div>
                  </div>
                )}

                      {activeHeroTab === 'images' && (
                  <div className="space-y-4">
                    <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Hero Images (Select up to 2 images)</label>
                            <div className="grid grid-cols-2 gap-4 max-w-2xl">
                              {/* Available hero images */}
                              {[
                                { url: '/images/hero/hero1.png', alt: 'Professional mobile detailing service in action' },
                                { url: '/images/hero/hero2.png', alt: 'High-quality car detailing and ceramic coating' }
                              ].map((image, index) => {
                                const isSelected = section.data.images?.includes(image.url) || false;
                                return (
                                  <div
                                    key={index}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                      isSelected 
                                        ? 'border-orange-500 ring-2 ring-orange-500/20' 
                                        : 'border-stone-600 hover:border-stone-500'
                                    }`}
                                    onClick={() => {
                                      const currentImages = section.data.images || [];
                                      let newImages;
                                      
                                      if (isSelected) {
                                        // Remove image if already selected
                                        newImages = currentImages.filter(img => img !== image.url);
                                      } else {
                                        // Add image if not selected and less than 2 images
                                        if (currentImages.length < 2) {
                                          newImages = [...currentImages, image.url];
                                        } else {
                                          // Replace first image if already have 2
                                          newImages = [image.url, currentImages[1]];
                                        }
                                      }
                                      
                                      updateContent(section.id, 'images', newImages);
                                    }}
                                  >
                                    <div className="aspect-video bg-stone-700 relative">
                                      <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          // Fallback for missing images
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          const fallback = document.createElement('div');
                                          fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-sm';
                                          fallback.textContent = 'Image not found';
                                          target.parentNode?.appendChild(fallback);
                                        }}
                                      />
                                      {isSelected && (
                                        <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                          <div className="bg-orange-500 text-white rounded-full p-2">
                                            <Check className="h-5 w-5" />
                                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              These images will rotate as the hero background on your website homepage.
                            </p>
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                )}
                    
                {section.id === 'services' && (
                  <div className="space-y-4">
                    {/* Service Images Grid */}
                      <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Service Images (6 services)</label>
                      <div className="grid grid-cols-3 gap-6 max-w-5xl">
                        {section.data.images?.map((service, index) => (
                            <div
                              key={service.slug}
                              className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                            >
                              <div className="aspect-[4/3] bg-stone-700 relative">
                                <img
                                  src={service.image}
                                  alt={service.alt}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback for missing images
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-sm';
                                    fallback.textContent = 'Image not found';
                                    target.parentNode?.appendChild(fallback);
                                  }}
                        />
                      </div>
                              <div className="p-4 bg-stone-800">
                                <p className="text-sm text-gray-300 font-medium text-center">
                                  {service.title}
                                </p>
                      </div>
                      </div>
                          )
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        These 6 service images will be displayed in the services grid on your website.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'reviews' && (
                  <div className="space-y-4">
                    {/* Reviews Sub-tabs */}
                    <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
                      <button
                        onClick={() => setActiveReviewsTab('content')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeReviewsTab === 'content'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Content
                      </button>
                      <button
                        onClick={() => setActiveReviewsTab('add-review')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeReviewsTab === 'add-review'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Review
                      </button>
                      <button
                        onClick={() => setActiveReviewsTab('remove-review')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeReviewsTab === 'remove-review'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Remove Review
                      </button>
                    </div>

                    {/* Reviews Sub-tab Content */}
                    <div className="transition-all duration-300 ease-in-out">
                      {activeReviewsTab === 'content' && (
                        <ReviewsContent tenantSlug={tenantSlug} />
                      )}
                      {activeReviewsTab === 'add-review' && (
                        <AddReviewForm tenantSlug={tenantSlug} />
                      )}
                      {activeReviewsTab === 'remove-review' && (
                        <RemoveReviewTab tenantSlug={tenantSlug} />
                      )}
                    </div>
                  </div>
                )}

                {section.id === 'faq' && (
                  <div className="space-y-4">
                    {/* FAQ Sub-tabs */}
                    <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
                      <button
                        onClick={() => setActiveFaqTab('content')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeFaqTab === 'content'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Content
                      </button>
                      <button
                        onClick={() => setActiveFaqTab('categories')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeFaqTab === 'categories'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Categories
                      </button>
                    </div>

                    {/* FAQ Sub-tab Content */}
                    <div className="transition-all duration-300 ease-in-out">
                      {activeFaqTab === 'content' && (
                  <div className="space-y-4">
                    <div className="w-2/5">
                      <WebsiteAutoSaveField
                        field="faq_title"
                        label="FAQ Title"
                        placeholder="Enter FAQ title"
                      />
                    </div>
                    <div className="w-2/5">
                      <WebsiteAutoSaveField
                        field="faq_subtitle"
                        label="FAQ Subtitle"
                        placeholder="Enter FAQ subtitle"
                      />
                    </div>
                        </div>
                      )}

                      {activeFaqTab === 'categories' && (
                        <div className="space-y-4">
                          {/* FAQ Category Sub-tabs */}
                          <div className="flex flex-wrap gap-1 bg-stone-800 rounded-lg p-1 mb-4">
                            {faqCategories.map((category) => (
                              <button
                                key={category}
                                onClick={() => setActiveFaqCategory(category)}
                                className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                  activeFaqCategory === category
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-stone-700'
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                    </div>
                    
                          {/* Category-specific FAQ Content */}
                    <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium text-gray-300">
                                {activeFaqCategory} FAQs
                              </label>
                              <button
                                onClick={() => {
                                  const currentContent = section.data.content || [];
                                  const newContent = [...currentContent, { 
                                    question: `New ${activeFaqCategory} question`, 
                                    answer: `New ${activeFaqCategory} answer`, 
                                    category: activeFaqCategory 
                                  }];
                                  updateContent(section.id, 'content', newContent);
                                }}
                                className="flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {activeFaqCategory} FAQ
                              </button>
                            </div>
                            
                      <div className="space-y-3">
                              {(() => {
                                // Only show custom FAQs for the current category from the database
                                const customFaqs = (section.data.content || []).filter((faq: any) => faq.category === activeFaqCategory);
                                
                                return customFaqs.map((faq: any, categoryIndex: number) => {
                                  // Find the global index in the full content array
                                  const globalIndex = (section.data.content || []).findIndex((item: any) => item === faq);
                                  
                                  return (
                                    <div key={`${activeFaqCategory}-${categoryIndex}`} className="rounded-lg p-4 bg-stone-700 border border-stone-600">
                                      <div className="grid grid-cols-1 gap-3">
                                        <FAQItemAutoSaveField
                                          faqIndex={globalIndex}
                                          field="question"
                                          label="Question"
                                          placeholder={`Enter ${activeFaqCategory.toLowerCase()} question...`}
                                        />
                                        
                                        <FAQItemAutoSaveField
                                          faqIndex={globalIndex}
                                          field="answer"
                                          label="Answer"
                                          type="textarea"
                                          rows={3}
                                          placeholder={`Enter ${activeFaqCategory.toLowerCase()} answer...`}
                                        />
                                        <div className="flex justify-end">
                                          <button
                                            onClick={() => {
                                              const currentContent = (section.data.content || []).filter((_: any, i: number) => i !== globalIndex);
                                              updateContent(section.id, 'content', currentContent);
                                            }}
                                            className="flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                          >
                                            <X className="h-3 w-3 mr-1" />
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                              
                              {/* Show message if no FAQs in this category */}
                              {(() => {
                                const customFaqs = (section.data.content || []).filter((faq: any) => faq.category === activeFaqCategory);
                                return customFaqs.length === 0;
                              })() && (
                                <div className="text-center py-8 text-gray-400">
                                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No {activeFaqCategory} FAQs yet</p>
                                  <p className="text-xs mt-1">Click "Add {activeFaqCategory} FAQ" to get started</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {section.id === 'gallery' && (
                  <div className="space-y-4">
                    {/* Gallery Sub-tabs */}
                    <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
                      <button
                        onClick={() => setActiveGalleryTab('stock')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeGalleryTab === 'stock'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Stock
                      </button>
                      <button
                        onClick={() => setActiveGalleryTab('custom')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeGalleryTab === 'custom'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Custom
                      </button>
                    </div>

                    {/* Gallery Sub-tab Content */}
                    <div className="transition-all duration-300 ease-in-out">
                      {activeGalleryTab === 'stock' && (
                        <div className="space-y-4">
                          {/* Stock Gallery Images Grid */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Stock Gallery Images</label>
                            <div className="grid grid-cols-4 gap-4 max-w-6xl">
                              {section.data.stockImages?.map((imageItem, index) => (
                                <div
                                  key={index}
                                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                                >
                                  <div className="aspect-square bg-stone-700 relative">
                                    <img
                                      src={imageItem.src}
                                      alt={imageItem.alt}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-sm';
                                        fallback.textContent = 'Image not found';
                                        target.parentNode?.appendChild(fallback);
                                      }}
                                    />
                                  </div>
                                  <div className="p-2 bg-stone-800">
                                    <p className="text-xs text-gray-300 truncate">
                                      {imageItem.alt}
                                    </p>
                            </div>
                          </div>
                        ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {section.data.stockImages?.length || 0} stock gallery images loaded from gallery.json
                            </p>
                          </div>
                        </div>
                      )}

                      {activeGalleryTab === 'custom' && (
                        <div className="space-y-4">
                          {/* Custom Gallery Images Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium text-gray-300">Custom Gallery Images</label>
                        <button
                          onClick={() => {
                                  // Add new custom image functionality
                                  const newCustomImage = {
                                    src: '',
                                    alt: '',
                                    title: '',
                                    caption: ''
                                  };
                                  setCustomGalleryImages(prev => [...prev, newCustomImage]);
                                }}
                                className="flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Custom Image
                        </button>
                      </div>
                            
                            <div className="grid grid-cols-4 gap-4 max-w-6xl">
                              {section.data.customImages?.map((imageItem, index) => (
                                <div
                                  key={index}
                                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                                >
                                  <div className="aspect-square bg-stone-700 relative">
                                    {imageItem.src ? (
                                      <img
                                        src={imageItem.src}
                                        alt={imageItem.alt || 'Custom gallery image'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          const fallback = document.createElement('div');
                                          fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-sm';
                                          fallback.textContent = 'Image not found';
                                          target.parentNode?.appendChild(fallback);
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                        <div className="text-center">
                                          <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                          <p>Add Image</p>
                    </div>
                  </div>
                )}
                                  </div>
                                  <div className="p-2 bg-stone-800">
                                    <p className="text-xs text-gray-300 truncate">
                                      {imageItem.alt || 'Custom Image'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {section.data.customImages?.length === 0 && (
                              <div className="text-center py-8 text-gray-400">
                                <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No custom images yet</p>
                                <p className="text-xs mt-1">Click "Add Custom Image" to get started</p>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500 mt-2">
                              {section.data.customImages?.length || 0} custom gallery images
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </WebsiteContentProvider>
  );
};

export default WebsiteContentTab;