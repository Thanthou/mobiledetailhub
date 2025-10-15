import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

import type { FAQItem } from '@/shared/api/websiteContent.api';
import { useAutoSave } from '@/shared/utils';

import { useWebsiteContent } from '../contexts/WebsiteContentContext';

interface FAQItemAutoSaveFieldProps {
  faqIndex: number;
  field: 'question' | 'answer';
  label: string;
  type?: 'text' | 'textarea';
  placeholder?: string;
  rows?: number;
}

export const FAQItemAutoSaveField: React.FC<FAQItemAutoSaveFieldProps> = ({
  faqIndex,
  field,
  label,
  type = 'text',
  placeholder,
  rows = 3,
}) => {
  const { contentData, updateContent } = useWebsiteContent();
  
  const getInitialValue = (): string => {
    if (!contentData?.faq_items) return '';
    const faqItem = contentData.faq_items[faqIndex];
    if (!faqItem) return '';
    return faqItem[field] || '';
  };

  const saveField = async (value: string) => {
    if (!contentData?.faq_items) return;
    
    const currentItem = contentData.faq_items[faqIndex];
    if (!currentItem) return;
    
    // Create updated FAQ items array
    const updatedFaqItems: FAQItem[] = [...contentData.faq_items];
    updatedFaqItems[faqIndex] = {
      ...currentItem,
      [field]: value
    };
    
    // Update the entire faq_items array
    await updateContent({ faq_items: updatedFaqItems });
  };

  const { value, setValue, isSaving, error } = useAutoSave(
    getInitialValue(),
    saveField,
    { debounce: 1000 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const getStatusIcon = () => {
    if (isSaving) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (value && value.trim() !== '') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 pr-10 bg-stone-600 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
              error ? 'border-red-500' : 'border-stone-500'
            }`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 bg-stone-600 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-stone-500'
            }`}
          />
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {getStatusIcon()}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

