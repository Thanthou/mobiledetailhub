import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

const UserMenu: React.FC = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const logout = authContext?.logout;
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

  const handleLogout = useCallback(() => {
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('authToken'); // Remove old key if it exists
    if (logout) {
      logout();
    }
    setIsOpen(false);
  }, [logout]);

  const handleAccountClick = useCallback(() => {
    setIsOpen(false);
    
    if (!user) return;
    
    // Route based on user role (less restrictive for development)
    if (user?.role === 'admin') {
      void navigate('/admin-dashboard');
    } else if (user?.role === 'affiliate') {
      void navigate('/affiliate-dashboard');
    } else {
      // For now, redirect customers to home page since client dashboard is not implemented
      // Fallback to home page for unknown roles
      void navigate('/');
    }
  }, [user, navigate]);

  // Get display name (prefer first name, fallback to full name or email)
  const getDisplayName = useCallback((): string => {
    if (!user) return 'User';
    
    if (user?.name) {
      const firstName = user.name.split(' ')[0];
      return firstName;
    }
    return user?.email?.split('@')[0] || 'User';
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        id="user-menu-button"
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200 font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{getDisplayName()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
          </div>
          
          <button
            onClick={handleAccountClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAccountClick();
              }
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <User className="h-4 w-4 mr-3" />
            Account
          </button>
          
          <button
            onClick={() => { setIsOpen(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(false);
              }
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            role="menuitem"
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={handleLogout}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogout();
              }
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;