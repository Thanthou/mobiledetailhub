import React from 'react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

import { useData } from '../contexts/DataProvider';

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

const SocialMediaIcons: React.FC = () => {
  // Always call hooks unconditionally
  const { isTenant, socialMedia, siteConfig, isPreview } = useData();
  
  // Use tenant social media if available, otherwise use site config
  const socials = isTenant ? socialMedia : siteConfig?.socials;
  
  const socialLinks = [
    {
      platform: 'Facebook',
      url: socials?.facebook,
      icon: SiFacebook,
      ariaLabel: 'Visit our Facebook page'
    },
    {
      platform: 'Instagram',
      url: socials?.instagram,
      icon: SiInstagram,
      ariaLabel: 'Visit our Instagram page'
    },
    {
      platform: 'TikTok',
      url: socials?.tiktok,
      icon: TikTokIcon,
      ariaLabel: 'Visit our TikTok page'
    },
    {
      platform: 'YouTube',
      url: socials?.youtube,
      icon: SiYoutube,
      ariaLabel: 'Visit our YouTube channel'
    }
  ];

  const visibleLinks = socialLinks.filter(link => {
    const url = link.url;
    return typeof url === 'string'; // Show if URL exists (even if empty)
  });

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 ml-4">
      {visibleLinks.map(({ platform, url, icon: Icon, ariaLabel }) => {
        const href = url as string;
        const hasUrl = href && href.trim() !== '';
        
        // In preview mode, render as span instead of link
        if (isPreview) {
          return (
            <span
              key={platform}
              className="text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer"
              aria-label={ariaLabel}
              title="Social media links available in your live site"
            >
              <Icon className="h-5 w-5" />
            </span>
          );
        }
        
        // If no URL, render as span (non-clickable)
        if (!hasUrl) {
          return (
            <span
              key={platform}
              className="text-white hover:text-orange-400 transition-colors duration-200 cursor-pointer"
              aria-label={ariaLabel}
              title="Social media link not configured"
            >
              <Icon className="h-5 w-5" />
            </span>
          );
        }
        
        // If has URL, render as clickable link
        return (
          <a 
            key={platform}
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-orange-400 transition-colors duration-200"
            aria-label={ariaLabel}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaIcons;
