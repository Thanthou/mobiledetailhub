import React from 'react';
import { Phone, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ConnectColumn: React.FC = () => {
  const { isLoggedIn, login } = useAuth();

  const handleLogin = () => {
    // Mock login - in real app this would open a login modal or redirect
    const mockUser = {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com'
    };
    login(mockUser);
  };

  const connectItems = [
    {
      icon: Phone,
      content: '(888) 555-1234',
      href: 'tel:+18885551234'
    },
    {
      icon: Mail,
      content: 'service@mobiledetailhub.com',
      href: 'mailto:service@mobiledetailhub.com'
    },
    {
      icon: UserPlus,
      content: 'Join as a Detailer',
      href: '/join-us'
    }
  ];

  return (
    <div className="text-center md:text-left md:justify-self-start">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Connect</h3>
      <div className="flex flex-col space-y-3">
        {connectItems.map((item, index) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith('http');
          const isJoinLink = item.href === '/join-us';
          
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
        
        {/* Login Button - Only show if not logged in */}
        {!isLoggedIn && (
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <LogIn className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <button
              onClick={handleLogin}
              className="text-lg hover:text-orange-400 transition-colors duration-200 bg-transparent border-none p-0 font-inherit cursor-pointer"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectColumn;