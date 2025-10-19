import React from 'react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

interface SocialMediaColumnProps {
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

const SocialMediaColumn: React.FC<SocialMediaColumnProps> = ({ socialMedia }) => {
  const socialLinks = [
    {
      platform: 'Facebook',
      url: socialMedia?.facebook,
      icon: SiFacebook,
      label: 'Facebook'
    },
    {
      platform: 'Instagram',
      url: socialMedia?.instagram,
      icon: SiInstagram,
      label: 'Instagram'
    },
    {
      platform: 'YouTube',
      url: socialMedia?.youtube,
      icon: SiYoutube,
      label: 'YouTube'
    }
  ];

  const visibleLinks = socialLinks.filter(link => link.url !== undefined); // Show if URL field exists (even if empty)

  return (
    <div className="text-center">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Follow Us</h3>
      <div className="inline-flex flex-col space-y-3 items-start">
        {visibleLinks.map(({ platform, url, icon: Icon, label }) => {
          const hasUrl = url && url.trim() !== '';
          
          // If no URL, render as span (non-clickable)
          if (!hasUrl) {
            return (
              <span
                key={platform}
                className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                title="Social media link not configured"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-lg">{label}</span>
              </span>
            );
          }
          
          // If has URL, render as clickable link
          return (
            <a 
              key={platform}
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-orange-400 transition-colors duration-200 flex items-center space-x-3"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-lg">{label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaColumn;
