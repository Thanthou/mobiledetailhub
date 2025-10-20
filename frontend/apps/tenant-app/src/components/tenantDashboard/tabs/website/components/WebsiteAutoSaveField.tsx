import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

import { useWebsiteContentField } from '../hooks/useWebsiteContentField';

type WebsiteContentField = 
  | 'hero_title'
  | 'hero_subtitle'
  | 'services_title'
  | 'services_subtitle'
  | 'services_auto_description'
  | 'services_marine_description'
  | 'services_rv_description'
  | 'services_ceramic_description'
  | 'services_correction_description'
  | 'services_ppf_description'
  | 'reviews_title'
  | 'reviews_subtitle'
  | 'reviews_avg_rating'
  | 'reviews_total_count'
  | 'faq_title'
  | 'faq_subtitle';

interface WebsiteAutoSaveFieldProps {
  field: WebsiteContentField;
  label: string;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  className?: string;
  debounce?: number;
  rows?: number;
  step?: string;
}

export const WebsiteAutoSaveField: React.FC<WebsiteAutoSaveFieldProps> = ({
  field,
  label,
  type = 'text',
  placeholder,
  className = '',
  debounce = 1000,
  rows = 3,
  step,
}) => {
  const { value, setValue, isSaving, error } = useWebsiteContentField({ 
    field, 
    debounce 
  });

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
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
              error ? 'border-red-500' : 'border-stone-600'
            } ${className}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            step={step}
            className={`w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-stone-600'
            } ${className}`}
          />
        )}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {getStatusIcon()}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {isSaving && (
        <p className="mt-1 text-sm text-blue-400">Saving...</p>
      )}
    </div>
  );
};

