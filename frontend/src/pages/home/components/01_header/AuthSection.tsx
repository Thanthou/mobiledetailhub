import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import UserMenu from './UserMenu';
import LoginButton from './LoginButton';

const AuthSection: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center">
      {isLoggedIn ? <UserMenu /> : <LoginButton />}
    </div>
  );
};

export default AuthSection;