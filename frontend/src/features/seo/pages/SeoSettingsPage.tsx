/**
 * SEO Settings Page
 * 
 * Dashboard page for tenants to edit their SEO configuration.
 */

import React from 'react';

import { Input } from '@/shared/ui';

interface SeoSettingsPageProps {
  seo: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
  };
  onSave: (field: string, value: string | string[]) => void;
}

export const SeoSettingsPage: React.FC<SeoSettingsPageProps> = ({ seo, onSave }) => {
  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
    onSave('keywords', keywords);
  };

  const keywordsString = seo.keywords?.join(', ') || '';

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">SEO Settings</h1>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="meta-title" className="block text-sm font-medium mb-2">Meta Title</label>
          <Input 
            id="meta-title"
            value={seo.meta_title || ''} 
            onChange={(e) => { onSave('meta_title', e.target.value); }} 
            placeholder="Enter your page title (max 60 characters)"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seo.meta_title?.length || 0}/60 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="meta-description" className="block text-sm font-medium mb-2">Meta Description</label>
          <Input 
            id="meta-description"
            value={seo.meta_description || ''} 
            onChange={(e) => { onSave('meta_description', e.target.value); }} 
            placeholder="Enter your page description (max 160 characters)"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seo.meta_description?.length || 0}/160 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-2">Keywords</label>
          <Input 
            id="keywords"
            value={keywordsString} 
            onChange={(e) => { handleKeywordsChange(e.target.value); }} 
            placeholder="Enter keywords separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate keywords with commas
          </p>
        </div>
      </div>
    </div>
  );
};
