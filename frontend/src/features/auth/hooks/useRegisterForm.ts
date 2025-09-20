import { useState } from 'react';

import { useFormValidation } from './useFormValidation';
import { usePasswordVisibility } from './usePasswordVisibility';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface UseRegisterFormProps {
  onSubmit: (email: string, password: string, name: string, phone: string) => Promise<void>;
  disabled: boolean;
}

export const useRegisterForm = ({ onSubmit, disabled }: UseRegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const { validateRegisterForm, getFieldError } = useFormValidation();
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (!validateRegisterForm(formData)) {
      return;
    }

    try {
      await onSubmit(formData.email, formData.password, formData.name, formData.phone);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return {
    formData,
    showPassword,
    handleSubmit,
    handleInputChange,
    getFieldError,
    togglePasswordVisibility
  };
};
