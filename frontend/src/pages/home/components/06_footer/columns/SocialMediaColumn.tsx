import { Facebook, Instagram, Youtube } from 'lucide-react';
import React from 'react';

import TikTokIcon from '../icons/TikTokIcon';

interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

interface SocialMediaColumnProps {
  socialMedia?: SocialMediaConfig;
}

const SocialMediaColumn: React.FC<SocialMediaColumnProps> = ({ socialMedia }) => {
  const socialLinks = [
    {
      platform: 'Facebook',
      url: socialMedia?.facebook,
      icon: Facebook,
      label: 'Facebook'
    },
    {
      platform: 'Instagram',
      url: socialMedia?.instagram,
      icon: Instagram,
      label: 'Instagram'
    },
    {
      platform: 'TikTok',
      url: socialMedia?.tiktok,
      icon: TikTokIcon,
      label: 'TikTok'
    },
    {
      platform: 'YouTube',
      url: socialMedia?.youtube,
      icon: Youtube,
      label: 'YouTube'
    }
  ];

  const visibleLinks = socialLinks.filter(link => link.url);

  return (
    <div className="text-center md:text-left">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Follow Us</h3>
      <div className="flex flex-col space-y-3">
        {visibleLinks.map(({ platform, url, icon: Icon, label }) => (
          <a 
            key={platform}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center justify-center md:justify-start space-x-3"
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-lg">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaColumn;