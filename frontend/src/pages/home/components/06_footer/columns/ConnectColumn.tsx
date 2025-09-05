import React, { useState } from 'react';
import { Phone, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { LazyLoginModal, prefetchLoginModal } from '../../../../../components/login';
import UserMenu from '../../01_header/UserMenu';
import { formatPhoneNumber } from '../../../../../utils/fields/phoneFormatter';

interface ConnectColumnProps {
  config?: {
    phone?: string;
    email?: string;
  };
}

const ConnectColumn: React.FC<ConnectColumnProps> = ({ config }) => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Use config values or fall back to defaults
  const phone = config?.phone || '+18885551234';
  const email = config?.email || 'service@mobiledetailhub.com';

  const connectItems = [
    {
      icon: Phone,
      content: formatPhoneNumber(phone),
      href: `tel:${phone.replace(/[^\d+]/g, '')}`
    },
    {
      icon: Mail,
      content: email,
      href: `mailto:${email}`
    },
    {
      icon: UserPlus,
      content: 'Join as a Detailer',
      href: '/affiliate-onboarding'
    }
  ];

  return (
    <div className="text-center md:text-left md:justify-self-start">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Connect</h3>
      <div className="flex flex-col space-y-3">
        {connectItems.map((item, index) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith('http');
          const isJoinLink = item.href === '/affiliate-onboarding';
          
          return (
            <div key={index} className="flex items-center justify-center md:justify-start space-x-3">
              <Icon className="h-5 w-5 flex-shrink-0 text-orange-400" />
              {isJoinLink ? (
                <a 
                  href={item.href}
                  className="text-lg hover:text-orange-400 transition-colors duration-200"
                >
                  {item.content}
                </a>
              ) : (
                <a 
                  href={item.href}
                  className="text-lg"
                  {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {item.content}
                </a>
              )}
            </div>
          );
        })}
        
        {/* Login Button - Show loading state while auth is loading */}
        {authLoading ? (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <LogIn className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <span className="text-lg text-gray-400">Loading...</span>
          </div>
        ) : !isLoggedIn ? (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <LogIn className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <button
              onClick={() => setShowLoginModal(true)}
              onMouseEnter={prefetchLoginModal}
              onFocus={prefetchLoginModal}
              className="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <LogIn className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <UserMenu />
          </div>
        )}
      </div>
      
      <LazyLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default ConnectColumn;