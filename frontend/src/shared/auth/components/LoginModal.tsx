import React from 'react';
import { createPortal } from 'react-dom';

import { useAuthModal, useModalFocus } from '../hooks';
import { LoginModalProps } from '../types';
import {
  ErrorDisplay,
  LoginForm,
  ModalBackdrop,
  ModalHeader,
  RegisterForm,
  SocialLogin,
  ToggleMode
} from './index';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    isLogin,
    error,
    loading,
    rateLimitInfo,
    countdown,
    handleLogin,
    handleRegister,
    handleToggleMode,
    handleClose
  } = useAuthModal(onClose);

  const { modalRef, firstFocusableRef, mounted } = useModalFocus(isOpen, handleClose);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <ModalBackdrop onClose={handleClose} />

      <div
        ref={modalRef}
        className="relative w-full max-w-md transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden"
          role="document"
        >
          <ModalHeader
            ref={firstFocusableRef}
            isLogin={isLogin}
            onClose={handleClose}
          />

          <ErrorDisplay
            error={error}
            rateLimitInfo={rateLimitInfo}
            countdown={countdown}
          />

          {isLogin ? (
            <LoginForm
              onSubmit={(email, password) => { void handleLogin(email, password); }}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
            />
          ) : (
            <RegisterForm
              onSubmit={(email, password, name, phone) => { void handleRegister(email, password, name, phone); }}
              loading={loading}
              error={error}
              disabled={rateLimitInfo !== null && countdown > 0}
            />
          )}

          <SocialLogin />

          <ToggleMode
            ref={firstFocusableRef}
            isLogin={isLogin}
            onToggle={handleToggleMode}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
