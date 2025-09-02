import React from 'react';
import { User, Building2, Link } from 'lucide-react';
import { AutoSaveField } from './AutoSaveField';
import type { ProfileData, ProfileFormData, ProfileValidationErrors } from '../types';

interface ProfileFormProps {
  profileData: ProfileData | null;
  validationErrors: ProfileValidationErrors;
  isUpdating: boolean;
  onSave: (data: ProfileFormData) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  validationErrors,
  isUpdating,
  onSave,
}) => {

  if (!profileData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
            type="text"
            placeholder="Enter your first name"
            debounce={800}
          />
          <AutoSaveField
            field="last_name"
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            debounce={800}
          />
          <AutoSaveField
            field="personal_phone"
            label="Personal Phone"
            type="tel"
            placeholder="(###) ###-####"
            debounce={1000}
          />
          <AutoSaveField
            field="personal_email"
            label="Personal Email"
            type="email"
            placeholder="Enter your personal email"
            debounce={800}
          />
        </div>
      </div>

      {/* Business Information Section */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Business Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AutoSaveField
              field="business_name"
              label="Business Name"
              type="text"
              placeholder="Enter your business name"
              debounce={800}
            />
          </div>
          <AutoSaveField
            field="business_email"
            label="Business Email"
            type="email"
            placeholder="Enter your business email"
            debounce={800}
          />
          <AutoSaveField
            field="business_start_date"
            label="Business Start Date"
            type="date"
            debounce={1000}
          />
          <AutoSaveField
            field="business_phone"
            label="Business Phone"
            type="tel"
            placeholder="(###) ###-####"
            debounce={1000}
          />
          <AutoSaveField
            field="twilio_phone"
            label="Twilio Phone (SMS)"
            type="tel"
            placeholder="+1 (###) ###-####"
            debounce={1000}
          />
        </div>
      </div>

      {/* URLs Section */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Link className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Social Media & Website</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData?.website_url || `http://mobiledetailhub.com/${profileData?.slug || ''}`}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-stone-600 text-gray-300 cursor-not-allowed"
              placeholder="Auto-generated based on your business slug"
            />
            <p className="mt-1 text-xs text-gray-400">Your website URL is automatically generated</p>
          </div>

          <div className="md:col-span-2">
            <AutoSaveField
              field="gbp_url"
              label="Google Business Profile"
              type="url"
              placeholder="https://business.google.com/your-business"
              debounce={1000}
            />
          </div>

          <AutoSaveField
            field="facebook_url"
            label="Facebook"
            type="url"
            placeholder="https://facebook.com/yourpage"
            debounce={1000}
          />
          <AutoSaveField
            field="youtube_url"
            label="YouTube"
            type="url"
            placeholder="https://youtube.com/@yourchannel"
            debounce={1000}
          />
          <AutoSaveField
            field="tiktok_url"
            label="TikTok"
            type="url"
            placeholder="https://tiktok.com/@yourusername"
            debounce={1000}
          />
          <AutoSaveField
            field="instagram_url"
            label="Instagram"
            type="url"
            placeholder="https://instagram.com/yourusername"
            debounce={1000}
          />
        </div>
      </div>
    </div>
  );
};
