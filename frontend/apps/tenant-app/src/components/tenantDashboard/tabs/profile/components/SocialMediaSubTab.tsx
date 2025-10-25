import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, MapPin, Facebook, Instagram, Youtube, Music } from 'lucide-react';

import { useProfileData } from '../hooks/useProfileData';

export const SocialMediaSubTab: React.FC = () => {
  const { businessData, updateBusiness } = useProfileData();
  
  const [gbpUrl, setGbpUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load initial data
  useEffect(() => {
    if (businessData) {
      setGbpUrl(businessData.gbp_url || '');
      setFacebookUrl(businessData.facebook_url || '');
      setInstagramUrl(businessData.instagram_url || '');
      setYoutubeUrl(businessData.youtube_url || '');
      setTiktokUrl(businessData.tiktok_url || '');
    }
  }, [businessData]);

  // Track changes
  useEffect(() => {
    if (!businessData) return;
    
    const changed = 
      gbpUrl !== (businessData.gbp_url || '') ||
      facebookUrl !== (businessData.facebook_url || '') ||
      instagramUrl !== (businessData.instagram_url || '') ||
      youtubeUrl !== (businessData.youtube_url || '') ||
      tiktokUrl !== (businessData.tiktok_url || '');
    
    setHasChanges(changed);
  }, [gbpUrl, facebookUrl, instagramUrl, youtubeUrl, tiktokUrl, businessData]);

  const handleCancel = () => {
    if (businessData) {
      setGbpUrl(businessData.gbp_url || '');
      setFacebookUrl(businessData.facebook_url || '');
      setInstagramUrl(businessData.instagram_url || '');
      setYoutubeUrl(businessData.youtube_url || '');
      setTiktokUrl(businessData.tiktok_url || '');
      setHasChanges(false);
      setSaveError(null);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const success = await updateBusiness({
        gbp_url: gbpUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        youtube_url: youtubeUrl,
        tiktok_url: tiktokUrl,
      });

      if (success) {
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError('Failed to save social media links');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl py-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Social Media Links</h3>
        <p className="text-sm text-gray-400">Connect your social media profiles to your website</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Changes saved successfully</p>
            <p className="text-sm text-green-600 mt-1">Your social media links have been updated.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Failed to save</p>
            <p className="text-sm text-red-600 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        <div>
          <label htmlFor="gbpUrl" className="block text-sm font-medium text-gray-200 mb-2">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              Google Business Profile
            </span>
          </label>
          <input
            type="url"
            id="gbpUrl"
            value={gbpUrl}
            onChange={(e) => setGbpUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="https://g.page/your-business"
          />
          <p className="text-xs text-gray-400 mt-1">Your Google Business Profile link</p>
        </div>

        <div>
          <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-200 mb-2">
            <span className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-500" />
              Facebook
            </span>
          </label>
          <input
            type="url"
            id="facebookUrl"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="https://facebook.com/your-business"
          />
        </div>

        <div>
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-200 mb-2">
            <span className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </span>
          </label>
          <input
            type="url"
            id="instagramUrl"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="https://instagram.com/your-business"
          />
        </div>

        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-200 mb-2">
            <span className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
            </span>
          </label>
          <input
            type="url"
            id="youtubeUrl"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="https://youtube.com/@your-business"
          />
        </div>

        <div>
          <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-200 mb-2">
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-400" />
              TikTok
            </span>
          </label>
          <input
            type="url"
            id="tiktokUrl"
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            placeholder="https://tiktok.com/@your-business"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

