import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleAccountClick = () => {
    setIsOpen(false);
    

    
    // Check if user email suggests admin status (temporary workaround)
    const isAdminByEmail = user?.email?.toLowerCase().includes('admin') || 
                           user?.email?.toLowerCase().includes('cole') ||
                           user?.name?.toLowerCase().includes('admin');
    

    
    // Route based on user role or email check
    if (user?.role === 'admin' || isAdminByEmail) {
      navigate('/admin-dashboard');
    } else if (user?.role === 'affiliate') {
      navigate('/affiliate-dashboard');
    } else if (user?.role === 'user') {
      navigate('/client-dashboard');
    } else {
      // Fallback to client dashboard for unknown roles
  
      navigate('/client-dashboard');
    }
  };

  // Get display name (prefer first name, fallback to full name or email)
  const getDisplayName = () => {
    if (user.name) {
      const firstName = user.name.split(' ')[0];
      return firstName;
    }
    return user.email.split('@')[0];
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200 font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{getDisplayName()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={handleAccountClick}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <User className="h-4 w-4 mr-3" />
            Account
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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