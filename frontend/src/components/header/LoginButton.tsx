import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Mock login - in real app this would open a login modal or redirect
    const mockUser = {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com'
    };
    login(mockUser);
  };

  return (
    <button
      onClick={handleLogin}
      className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
    >
      Login
    </button>
  );
};

export default LoginButton;