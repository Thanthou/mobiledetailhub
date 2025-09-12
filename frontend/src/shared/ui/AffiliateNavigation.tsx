import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2,ChevronDown, Home, User } from 'lucide-react';

import { useAffiliates } from '@/shared/hooks';

const AffiliateNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { affiliates, isLoading, error } = useAffiliates();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedAffiliate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleNavigation = useCallback((path: string) => {
    void navigate(path);
    setIsOpen(false);
    setSelectedAffiliate(null);
  }, [navigate]);

  const handleAffiliateSelect = useCallback((slug: string) => {
    setSelectedAffiliate(slug);
  }, []);

  const handleAffiliateSite = useCallback((slug: string) => {
    handleNavigation(`/${slug}`);
  }, [handleNavigation]);

  const handleAffiliateDashboard = useCallback((slug: string) => {
    handleNavigation(`/${slug}/dashboard`);
  }, [handleNavigation]);

  if (isLoading) {
    return (
      <div className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium">
        Loading...
      </div>
    );
  }

  if (error || affiliates.length === 0) {
    return (
      <div className="bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium">
        No Affiliates
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Affiliate Button */}
      <button
        id="affiliate-menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-4 w-4" />
        <span>Affiliates</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="affiliate-menu-button"
        >
          {affiliates.map((affiliate) => (
            <div key={affiliate.slug} className="group">
              {/* Affiliate Header */}
              <button
                onClick={() => { handleAffiliateSelect(affiliate.slug); }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                role="menuitem"
              >
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-3" />
                  <span className="font-medium">{affiliate.name}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${selectedAffiliate === affiliate.slug ? 'rotate-180' : ''}`} />
              </button>

              {/* Affiliate Submenu */}
              {selectedAffiliate === affiliate.slug && (
                <div className="ml-4 border-l border-gray-200 pl-2">
                  <button
                    onClick={() => { handleAffiliateSite(affiliate.slug); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <Home className="h-4 w-4 mr-3" />
                    {affiliate.name} Site
                  </button>
                  
                  <button
                    onClick={() => { handleAffiliateDashboard(affiliate.slug); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 mr-3" />
                    {affiliate.name} Dashboard
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateNavigation;
