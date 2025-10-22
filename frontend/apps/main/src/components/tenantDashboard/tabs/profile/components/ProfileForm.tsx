import React, { useState, useEffect } from 'react';
import { Building2, Link, User } from 'lucide-react';

import { AutoSaveField } from './AutoSaveField';
import { useProfileData } from '../hooks/useProfileData';

const ProfileForm: React.FC = () => {
  const { businessData, updateBusiness, isUpdating } = useProfileData();
  
  const handleSocialMediaToggle = async (platform: string, enabled: boolean) => {
    const fieldName = `${platform}_enabled` as keyof BusinessData;
    await updateBusiness({ [fieldName]: enabled });
  };

  return (
    <div className="space-y-8">
      {/* Business Information Section */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Business Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutoSaveField
            field="business_name"
            label="Business Name"
            placeholder="Enter your business name"
          />
          <AutoSaveField
            field="business_email"
            label="Business Email"
            type="email"
            placeholder="Enter your business email"
          />
          <AutoSaveField
            field="business_phone"
            label="Business Phone"
            type="tel"
            placeholder="(###) ###-####"
          />
          <AutoSaveField
            field="twilio_phone"
            label="Twilio Phone (SMS)"
            type="tel"
            placeholder="+1 (###) ###-####"
          />
          <div className="md:col-span-2">
            <AutoSaveField
              field="business_start_date"
              label="Business Start Date"
              type="date"
            />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutoSaveField
            field="first_name"
            label="First Name"
            placeholder="Enter your first name"
          />
          <AutoSaveField
            field="last_name"
            label="Last Name"
            placeholder="Enter your last name"
          />
          <AutoSaveField
            field="personal_phone"
            label="Personal Phone"
            type="tel"
            placeholder="(###) ###-####"
          />
          <AutoSaveField
            field="personal_email"
            label="Personal Email"
            type="email"
            placeholder="Enter your personal email"
          />
        </div>
      </div>

      {/* URLs Section */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Link className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">URLs & Social Media</h3>
        </div>
        
        <div className="space-y-6">
          {/* Website URL is auto-generated and read-only */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Website URL (Auto-generated)
            </label>
            <div className="px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-gray-400 cursor-not-allowed">
              http://{businessData?.slug || 'your-slug'}.thatsmartsite.com
            </div>
            <p className="text-xs text-gray-500">
              This URL is automatically generated based on your business slug and cannot be changed.
            </p>
          </div>
          
          <AutoSaveField
            field="gbp_url"
            label="Google Business Profile URL"
            type="url"
            placeholder="https://business.google.com/your-business"
          />
          <div className="space-y-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <AutoSaveField
                  field="facebook_url"
                  label="Facebook URL"
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                    disabled={!businessData?.facebook_enabled}
                />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <input
                  type="checkbox"
                  id="facebook_enabled"
                    checked={businessData?.facebook_enabled ?? true}
                  onChange={(e) => handleSocialMediaToggle('facebook', e.target.checked)}
                  disabled={isUpdating}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="facebook_enabled" className="text-sm font-medium text-gray-300">
                  Enable
                </label>
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <AutoSaveField
                  field="youtube_url"
                  label="YouTube URL"
                  type="url"
                  placeholder="https://youtube.com/@yourchannel"
                    disabled={!businessData?.youtube_enabled}
                />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <input
                  type="checkbox"
                  id="youtube_enabled"
                    checked={businessData?.youtube_enabled ?? true}
                  onChange={(e) => handleSocialMediaToggle('youtube', e.target.checked)}
                  disabled={isUpdating}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="youtube_enabled" className="text-sm font-medium text-gray-300">
                  Enable
                </label>
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <AutoSaveField
                  field="tiktok_url"
                  label="TikTok URL"
                  type="url"
                  placeholder="https://tiktok.com/@yourusername"
                    disabled={!businessData?.tiktok_enabled}
                />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <input
                  type="checkbox"
                  id="tiktok_enabled"
                    checked={businessData?.tiktok_enabled ?? true}
                  onChange={(e) => handleSocialMediaToggle('tiktok', e.target.checked)}
                  disabled={isUpdating}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="tiktok_enabled" className="text-sm font-medium text-gray-300">
                  Enable
                </label>
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <AutoSaveField
                  field="instagram_url"
                  label="Instagram URL"
                  type="url"
                  placeholder="https://instagram.com/yourusername"
                    disabled={!businessData?.instagram_enabled}
                />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <input
                  type="checkbox"
                  id="instagram_enabled"
                    checked={businessData?.instagram_enabled ?? true}
                  onChange={(e) => handleSocialMediaToggle('instagram', e.target.checked)}
                  disabled={isUpdating}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="instagram_enabled" className="text-sm font-medium text-gray-300">
                  Enable
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileForm };