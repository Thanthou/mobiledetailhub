import React from 'react';

import { AutoSaveInput } from '@shared/ui';

import { useSocialMediaUrl } from '../hooks/useSocialMediaUrl';

interface SocialMediaUrlFieldProps {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  label: string;
  placeholder?: string;
  disabled?: boolean;
  debounce?: number;
}

/**
 * Auto-save field component for social media URLs
 * Uses the same pattern as AutoSaveField but updates the social_media JSONB field
 */
export const SocialMediaUrlField: React.FC<SocialMediaUrlFieldProps> = ({
  platform,
  label,
  placeholder,
  disabled = false,
  debounce = 1000,
}) => {
  const { value, setValue, isSaving, error } = useSocialMediaUrl({ 
    platform, 
    debounce 
  });

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <AutoSaveInput
        type="url"
        value={value}
        onChange={handleChange}
        isSaving={isSaving}
        error={error}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};
