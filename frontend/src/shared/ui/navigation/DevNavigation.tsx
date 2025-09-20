import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Home, Shield, UserPlus } from 'lucide-react';

const DevNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleNavigation = useCallback((path: string) => {
    void navigate(path);
    setIsOpen(false);
  }, [navigate]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Admin Button */}
      <button
        id="admin-menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Shield className="h-4 w-4" />
        <span>Admin</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="admin-menu-button"
        >
          <button
            onClick={() => { handleNavigation('/'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <Home className="h-4 w-4 mr-3" />
            Main Site
          </button>
          
          <button
            onClick={() => { handleNavigation('/admin-dashboard'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <Shield className="h-4 w-4 mr-3" />
            Admin Dashboard
          </button>
          
          <button
            onClick={() => { handleNavigation('/affiliate-onboarding'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <UserPlus className="h-4 w-4 mr-3" />
            Affiliate Onboarding
          </button>
        </div>
      )}
    </div>
  );
};

export default DevNavigation;
