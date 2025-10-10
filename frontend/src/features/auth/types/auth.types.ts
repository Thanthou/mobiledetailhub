import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LazyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string;
  disabled?: boolean;
}

export interface RegisterFormProps {
  onSubmit: (email: string, password: string, name: string, phone: string) => Promise<void>;
  loading: boolean;
  error?: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  error?: string | undefined;
  required?: boolean;
  rightElement?: React.ReactNode;
  autocomplete?: string;
  disabled?: boolean;
}

export interface ModalHeaderProps {
  isLogin: boolean;
  onClose: () => void;
}

export interface ToggleModeProps {
  isLogin: boolean;
  onToggle: () => void;
}

export interface RateLimitInfo {
  retryAfterSeconds: number;
  remainingAttempts?: number;
  resetTime?: number;
}

export type FieldErrors = Record<string, string[]>;

// Social login types
export interface SocialLoginProvider {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}
