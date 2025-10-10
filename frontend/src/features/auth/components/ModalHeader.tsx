/* eslint-disable react/prop-types -- Using TypeScript interfaces instead of PropTypes */
import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  isLogin: boolean;
  onClose: () => void;
}

const ModalHeader = forwardRef<HTMLButtonElement, ModalHeaderProps>(
  ({ isLogin, onClose }, ref) => {
    return (
      <div className="relative px-8 pt-8 pb-2">
        <button
          ref={ref}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900"
          aria-label="Close login modal"
          type="button"
          tabIndex={0}
        >
          <X size={20} aria-hidden="true" />
        </button>
        
        <div className="text-center mb-2">
          <div 
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center p-2"
            aria-hidden="true"
          >
            <img 
              src="/icons/favicon.webp" 
              alt="Mobile Detail Hub Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h2 
            id="login-modal-title"
            className="text-2xl font-bold text-white mb-1"
          >
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p 
            id="login-modal-description"
            className="text-gray-400 text-sm"
          >
            {isLogin ? 'Sign in to your account to continue' : 'Sign up to get started'}
          </p>
        </div>
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
/* eslint-enable react/prop-types -- Re-enable PropTypes rule after component definition */