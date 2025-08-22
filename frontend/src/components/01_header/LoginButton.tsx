import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../login';
import UserMenu from './UserMenu';

const LoginButton: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (isLoggedIn) {
    return <UserMenu />;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
      >
        Login
      </button>

      <LoginModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default LoginButton;