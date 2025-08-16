import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

// Custom TikTok icon component
const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

interface SocialMediaIconsProps {
  socialMedia: SocialMediaConfig;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ socialMedia }) => {
  const socialLinks = [
    {
      platform: 'Facebook',
      url: socialMedia.facebook,
      icon: Facebook,
      ariaLabel: 'Visit our Facebook page'
    },
    {
      platform: 'Instagram',
      url: socialMedia.instagram,
      icon: Instagram,
      ariaLabel: 'Visit our Instagram page'
    },
    {
      platform: 'TikTok',
      url: socialMedia.tiktok,
      icon: TikTokIcon,
      ariaLabel: 'Visit our TikTok page'
    },
    {
      platform: 'YouTube',
      url: socialMedia.youtube,
      icon: Youtube,
      ariaLabel: 'Visit our YouTube channel'
    }
  ];

  const visibleLinks = socialLinks.filter(link => link.url);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 ml-4">
      {visibleLinks.map(({ platform, url, icon: Icon, ariaLabel }) => (
        <a 
          key={platform}
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-orange-400 transition-colors duration-200"
          aria-label={ariaLabel}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
};

export default SocialMediaIcons;