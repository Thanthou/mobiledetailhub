import React from 'react';
import { Building2, Link, User } from 'lucide-react';
import { AutoSaveField } from './AutoSaveField';

const ProfileForm: React.FC = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AutoSaveField
              field="website"
              label="Website URL"
              type="url"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="md:col-span-2">
            <AutoSaveField
              field="gbp_url"
              label="Google Business Profile URL"
              type="url"
              placeholder="https://business.google.com/your-business"
            />
          </div>
          <div className="md:col-span-2">
            <AutoSaveField
              field="google_maps_url"
              label="Google Maps URL"
              type="url"
              placeholder="https://maps.google.com/maps/place/your-business"
            />
          </div>
          <AutoSaveField
            field="facebook_url"
            label="Facebook URL"
            type="url"
            placeholder="https://facebook.com/yourpage"
          />
          <AutoSaveField
            field="youtube_url"
            label="YouTube URL"
            type="url"
            placeholder="https://youtube.com/@yourchannel"
          />
          <AutoSaveField
            field="tiktok_url"
            label="TikTok URL"
            type="url"
            placeholder="https://tiktok.com/@yourusername"
          />
          <AutoSaveField
            field="instagram_url"
            label="Instagram URL"
            type="url"
            placeholder="https://instagram.com/yourusername"
          />
        </div>
      </div>
    </div>
  );
};

export { ProfileForm };