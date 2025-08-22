import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { AffiliateApplication } from '../types';
import GoogleBusinessProfileModal from './GoogleBusinessProfileModal';

interface SocialMediaSectionProps {
  formData: AffiliateApplication;
  handleInputChange: (field: string, value: any) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  formData,
  handleInputChange
}) => {
  const [isGoogleProfileModalOpen, setIsGoogleProfileModalOpen] = useState(false);

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-orange-400" />
          Social Media & Portfolio
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Share your online presence and portfolio links
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="website_url" className="block text-gray-300 text-sm font-medium mb-2">
              Website
            </label>
            <input 
              id="website_url"
              name="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div>
            <label htmlFor="gbp_url" className="block text-gray-300 text-sm font-medium mb-2">
              Google Business Profile URL
              {formData.legal_name && (
                <button
                  onClick={() => setIsGoogleProfileModalOpen(true)}
                  className="inline-flex items-center ml-2 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                  title="Find your Google Business Profile"
                >
                  🔍 Find my profile
                </button>
              )}
            </label>
            <input 
              id="gbp_url"
              name="gbp_url"
              type="url"
              value={formData.gbp_url}
              onChange={(e) => handleInputChange('gbp_url', e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://business.google.com/..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebook_url" className="block text-gray-300 text-sm font-medium mb-2">Facebook</label>
              <input 
                id="facebook_url"
                name="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label htmlFor="instagram_url" className="block text-gray-300 text-sm font-medium mb-2">Instagram</label>
              <input 
                id="instagram_url"
                name="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="youtube_url" className="block text-gray-300 text-sm font-medium mb-2">YouTube</label>
              <input 
                id="youtube_url"
                name="youtube_url"
                type="url"
                value={formData.youtube_url || ''}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://youtube.com/@..."
              />
            </div>
            <div>
              <label htmlFor="tiktok_url" className="block text-gray-300 text-sm font-medium mb-2">TikTok</label>
              <input 
                id="tiktok_url"
                name="tiktok_url"
                type="url"
                value={formData.tiktok_url}
                onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                className="w-full bg-stone-700 border border-stone-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
          
          <div className="bg-stone-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Tip:</span> You don't need to fill in all fields. 
              Just share the platforms where you're most active and showcase your best work.
            </p>
          </div>
        </div>
      </div>

      {/* Google Business Profile Modal */}
      <GoogleBusinessProfileModal
        isOpen={isGoogleProfileModalOpen}
        onClose={() => setIsGoogleProfileModalOpen(false)}
        businessName={formData.legal_name}
        onUrlFound={(url) => {
          handleInputChange('gbp_url', url);
          setIsGoogleProfileModalOpen(false);
        }}
      />
    </div>
  );
};

export default SocialMediaSection;
