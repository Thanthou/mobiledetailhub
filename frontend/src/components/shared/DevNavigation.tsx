import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, Settings, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Affiliate {
  id: number;
  slug: string;
  business_name: string;
  owner: string;
}

const DevNavigation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch affiliates when menu opens
  const fetchAffiliates = async () => {
    if (loading || affiliates.length > 0) return; // Don't refetch if already loaded
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users?role=affiliate', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.users) {
          setAffiliates(data.users);
        }
      } else {
        console.log(`DEV: Could not fetch affiliates (${response.status})`);
      }
    } catch (error) {
      console.log('DEV: Could not fetch affiliates (backend may be down)');
    } finally {
      setLoading(false);
    }
  };

  // Only render in development mode AND when logged in as admin
  if (!import.meta.env.DEV || !user || user.role !== 'admin') {
    return null;
  }

  const handleNavigation = (path: string) => {
    console.log(`DEV Navigation: Going to ${path}`);
    setIsOpen(false);
    navigate(path);
  };

  const handleMenuToggle = () => {
    if (!isOpen) {
      fetchAffiliates(); // Fetch affiliates when opening menu
    }
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={menuRef}
      className="fixed top-4 right-4 z-[9999]"
    >
      {/* DEV Button */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center space-x-2 px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
        title="Developer Navigation"
      >
        <Globe className="h-4 w-4" />
        <span>DEV</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">🚀 Development Navigation</p>
            <p className="text-xs text-gray-500">Quick access to all pages</p>
          </div>
          
          <button
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-3 text-green-600" />
            MDH Main Site
          </button>
          
          <button
            onClick={() => handleNavigation('/admin-dashboard')}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-3 text-red-600" />
            Admin Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/affiliate-onboarding')}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Globe className="h-4 w-4 mr-3 text-purple-600" />
            Affiliate Onboarding
          </button>
          
          {/* Affiliate Sites Section */}
          {affiliates.length > 0 && (
            <>
              <hr className="my-2" />
              <div className="px-4 py-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate Sites</p>
              </div>
              {affiliates.map((affiliate) => (
                <button
                  key={affiliate.id}
                  onClick={() => handleNavigation(`/${affiliate.slug}`)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  title={`${affiliate.business_name} - ${affiliate.owner}`}
                >
                  <Globe className="h-4 w-4 mr-3 text-orange-600" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{affiliate.slug}</span>
                    <span className="text-xs text-gray-500 truncate">{affiliate.business_name}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {loading && (
            <>
              <hr className="my-2" />
              <div className="px-4 py-2 text-center">
                <p className="text-xs text-gray-500">Loading affiliates...</p>
              </div>
            </>
          )}

          <hr className="my-2" />
          
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400">Current: {window.location.pathname}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevNavigation;
