import React from 'react';
import { Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

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


interface FooterProps {
  contactPhone: string;
  location: string;
  email: string;
  quickLinks: { name: string; href: string; onClick?: () => void }[];
  attribution: {
    text: string;
    link: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const Footer: React.FC<FooterProps> = ({ contactPhone, location, email, quickLinks, attribution, socialLinks, onBookNow, onRequestQuote }) => {
  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-32 mb-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Get In Touch</h3>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-400" />
              <span className="text-lg text-white">
                {contactPhone}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-orange-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <button 
                onClick={onRequestQuote}
                className="text-lg hover:text-orange-400 transition-colors duration-200 hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
              >
                {email}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-400" />
              <span className="text-lg text-gray-300">{location}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.onClick) {
                        e.preventDefault();
                        link.onClick();
                      }
                    }}
                    className="text-lg hover:text-orange-400 transition-colors duration-200 flex items-center"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          {socialLinks && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Follow Us</h3>
              <div className="flex flex-col space-y-4">
                {socialLinks.facebook && (
                  <a 
                    href={socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    <Facebook className="h-7 w-7" />
                    <span className="text-xl">Facebook</span>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a 
                    href={socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    <Instagram className="h-7 w-7" />
                    <span className="text-xl">Instagram</span>
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a 
                    href={socialLinks.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    <TikTokIcon className="h-7 w-7" />
                    <span className="text-xl">TikTok</span>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a 
                    href={socialLinks.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    <Youtube className="h-7 w-7" />
                    <span className="text-xl">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Get Started</h3>
            <div className="space-y-4">
              <button
                onClick={onBookNow}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full text-center"
              >
                Book Now
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onRequestQuote?.();
                }}
                className="inline-block bg-transparent border-2 border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full text-center"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-400 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-300">
              © 2025 JP's Mobile Detail. All rights reserved.
            </p>
          </div>
          <div className="text-center md:text-right">
            <a
              href={attribution.link}
              className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {attribution.text}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;