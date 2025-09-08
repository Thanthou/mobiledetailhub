import { ChevronDown, Globe, Home, Settings, UserPlus } from 'lucide-react';
import React, { useEffect,useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const DevNavigation: React.FC = () => {
  const { user, loading } = useAuth();
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



  // Don't render while loading or if not in development mode
  if (loading || !import.meta.env.DEV) {
    return null;
  }

  // Only render when logged in as admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleNavigation = (path: string) => {
    // DEV Navigation: Going to path
    setIsOpen(false);
    void navigate(path);
  };

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={menuRef}
      className="relative"
    >
      {/* DEV Button */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        title="Developer Navigation"
      >
        <Globe className="h-4 w-4" />
        <span>Admin</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <button
            onClick={() => { handleNavigation('/'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-3 text-green-600" />
            MDH Main Site
          </button>
          
          <button
            onClick={() => { handleNavigation('/admin-dashboard'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-3 text-red-600" />
            Admin Dashboard
          </button>
          
          <button
            onClick={() => { handleNavigation('/affiliate-onboarding'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4 mr-3 text-purple-600" />
            Affiliate Onboarding
          </button>
        </div>
      )}
    </div>
  );
};

export default DevNavigation;
