import React from 'react';

import { useAuth } from '@/shared/hooks';

import LoginButton from './LoginButton';
import UserMenu from './UserMenu';

const AuthSection: React.FC = () => {
  const authContext = useAuth();
  const isLoggedIn = authContext.isLoggedIn;

  return (
    <div className="flex items-center">
      {isLoggedIn ? <UserMenu /> : <LoginButton />}
    </div>
  );
};

export default AuthSection;
