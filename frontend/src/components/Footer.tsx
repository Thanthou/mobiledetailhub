import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  contactPhone: string;
  location: string;
  email: string;
  quickLinks: { name: string; href: string; onClick?: () => void }[];
  attribution: {
    text: string;
    link: string;
  };
  onRequestQuote?: () => void;
}

const Footer: React.FC<FooterProps> = ({ contactPhone, location, email, quickLinks, attribution, onRequestQuote }) => {
  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Get In Touch</h3>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-400" />
              <a href={`tel:${contactPhone}`} className="text-lg hover:text-orange-400 transition-colors duration-200">
                {contactPhone}
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-orange-400" />
              <a href={`mailto:${email}`} className="text-lg hover:text-orange-400 transition-colors duration-200">
                {email}
              </a>
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

          {/* Call to Action */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Get Started</h3>
            <div className="space-y-4">
              <a
                href="/booking?detailer_id=joe123"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full text-center"
              >
                Book Now
              </a>
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