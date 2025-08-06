import React from 'react';
import { Phone, MapPin, Menu } from 'lucide-react';

interface HeaderProps {
  businessName: string;
  phone: string;
  location: string;
  navLinks: { name: string; href: string; onClick?: () => void }[];
}

const Header: React.FC<HeaderProps> = ({ businessName, phone, location, navLinks }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Business Name */}
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{businessName}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-200 mt-1">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-orange-400 transition-colors duration-200">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;