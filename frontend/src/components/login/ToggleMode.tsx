import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

interface ToggleModeProps {
  isLogin: boolean;
  onToggle: () => void;
}

const ToggleMode = forwardRef<HTMLButtonElement, ToggleModeProps>(
  ({ isLogin, onToggle }, ref) => {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            ref={ref}
            type="button"
            onClick={onToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle();
              }
            }}
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-900 rounded px-2 py-1"
            aria-label={isLogin ? 'Switch to registration form' : 'Switch to login form'}
            aria-describedby={`toggle-mode-description-${isLogin ? 'login' : 'register'}`}
            tabIndex={0}
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </button>
          <span 
            id={`toggle-mode-description-${isLogin ? 'login' : 'register'}`}
            className="sr-only"
          >
            {isLogin 
              ? 'Click to switch to the registration form where you can create a new account'
              : 'Click to switch to the login form where you can sign in to your existing account'
            }
          </span>
        </p>
      </div>
    );
  }
);

ToggleMode.displayName = 'ToggleMode';

ToggleMode.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ToggleMode;
