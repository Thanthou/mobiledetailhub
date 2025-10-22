import React from 'react';

const LoginButton: React.FC = () => {
  return (
    <button className="text-white hover:text-cyan-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md">
      Login
    </button>
  );
};

export default LoginButton;