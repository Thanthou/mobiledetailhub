import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Eye, FileText, HelpCircle, Plus, Save, X } from 'lucide-react';

import { useData } from '@/shared/hooks';
import { loadIndustryFAQs } from '@/shared/utils/faqLoader';

import { FAQItemAutoSaveField } from './FAQItemAutoSaveField';
import { WebsiteAutoSaveField } from './WebsiteAutoSaveField';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqContent?: FAQItem[];
  onUpdateContent: (field: string, value: unknown) => void;
  onResetToDefault: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqContent,
  onUpdateContent,
  onResetToDefault,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'categories'>('content');
  const [activeCategory, setActiveCategory] = useState<string>('Services');

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

  // Load industry-specific FAQs for template picker
  const { industry } = useData();
  const [industryFAQs, setIndustryFAQs] = React.useState<Array<{ question: string; answer: string; category: string }>>([]);
  
  React.useEffect(() => {
    if (!industry) return;
    loadIndustryFAQs(industry)
      .then(setIndustryFAQs)
      .catch(() => {
        setIndustryFAQs([]);
      });
  }, [industry]);
  
  const _categoryFaqMap = useMemo(() => {
    const map: Record<string, typeof industryFAQs> = {};
    industryFAQs.forEach(faq => {
      if (!map[faq.category]) {
        map[faq.category] = [];
      }
      map[faq.category].push(faq);
    });
    return map;
  }, [industryFAQs]);

  const handleAddFAQ = () => {
    const currentContent = faqContent || [];
    const newContent = [...currentContent, { 
      question: `New ${activeCategory} question`, 
      answer: `New ${activeCategory} answer`, 
      category: activeCategory 
    }];
    onUpdateContent('content', newContent);
  };

  const handleRemoveFAQ = (globalIndex: number) => {
    const currentContent = faqContent || [];
    const newContent = currentContent.filter((_item, i) => i !== globalIndex);
    onUpdateContent('content', newContent);
  };

  const customFaqs = (faqContent || []).filter((faq) => faq.category === activeCategory);

  return (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">FAQ</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { /* Preview functionality */ }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </button>
          <button
            onClick={onResetToDefault}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            Default
          </button>
          <button
            onClick={() => { setIsCollapsed(!isCollapsed); }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {/* FAQ Sub-tabs */}
          <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => { setActiveTab('content'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content
            </button>
            <button
              onClick={() => { setActiveTab('categories'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'categories'
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
            {activeTab === 'content' && (
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

            {activeTab === 'categories' && (
              <div className="space-y-4">
                {/* FAQ Category Sub-tabs */}
                <div className="flex flex-wrap gap-1 bg-stone-800 rounded-lg p-1 mb-4">
                  {faqCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => { setActiveCategory(category); }}
                      className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        activeCategory === category
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
                    <div className="block text-sm font-medium text-gray-300">
                      {activeCategory} FAQs
                    </div>
                    <button
                      onClick={handleAddFAQ}
                      className="flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add {activeCategory} FAQ
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {customFaqs.map((faq, categoryIndex) => {
                      const currentContent = faqContent || [];
                      const globalIndex = currentContent.findIndex((item) => item === faq);
                      
                      return (
                        <div key={`${activeCategory}-${categoryIndex}`} className="rounded-lg p-4 bg-stone-700 border border-stone-600">
                          <div className="grid grid-cols-1 gap-3">
                            <FAQItemAutoSaveField
                              faqIndex={globalIndex}
                              field="question"
                              label="Question"
                              placeholder={`Enter ${activeCategory.toLowerCase()} question...`}
                            />
                            
                            <FAQItemAutoSaveField
                              faqIndex={globalIndex}
                              field="answer"
                              label="Answer"
                              type="textarea"
                              rows={3}
                              placeholder={`Enter ${activeCategory.toLowerCase()} answer...`}
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => { handleRemoveFAQ(globalIndex); }}
                                className="flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Show message if no FAQs in this category */}
                    {customFaqs.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No {activeCategory} FAQs yet</p>
                        <p className="text-xs mt-1">Click &quot;Add {activeCategory} FAQ&quot; to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

