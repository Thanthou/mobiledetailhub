import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import TikTokIcon from '../../07_footer/icons/TikTokIcon';

interface SocialMediaColumnProps {
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

const SocialMediaColumn: React.FC<SocialMediaColumnProps> = ({ socialMedia }) => {
  if (!socialMedia) {
    return null;
  }

  const socialLinks = [
    {
      platform: 'Facebook',
      url: socialMedia?.facebook,
      icon: Facebook,
      color: 'hover:text-blue-500'
    },
    {
      platform: 'Instagram',
      url: socialMedia?.instagram,
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      platform: 'TikTok',
      url: socialMedia?.tiktok,
      icon: TikTokIcon,
      color: 'hover:text-black'
    },
    {
      platform: 'YouTube',
      url: socialMedia?.youtube,
      icon: Youtube,
      color: 'hover:text-red-500'
    }
  ];

  const visibleLinks = socialLinks.filter(link => link.url);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="text-left">
      <h3 className="text-xl font-bold mb-8 text-white">Follow Us</h3>
      <div className="flex flex-col space-y-6">
        {visibleLinks.map(({ platform, url, icon: Icon, color }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-orange-500 ${color} transition-colors duration-200 transform hover:scale-110 flex items-center space-x-3`}
            aria-label={`Visit our ${platform} page`}
          >
            <Icon className="h-8 w-8 flex-shrink-0" />
            <span className="text-white text-lg font-medium">{platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaColumn;