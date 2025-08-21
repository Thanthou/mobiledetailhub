import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <span className="text-white text-sm">Welcome, {user.name}</span>
      <button
        onClick={logout}
        className="text-white hover:text-orange-400 transition-colors duration-200 font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
