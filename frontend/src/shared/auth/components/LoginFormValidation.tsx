import React, { useState } from 'react';

interface LoginFormValidationProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  disabled: boolean;
}

export const useLoginFormValidation = ({ onSubmit, disabled }: LoginFormValidationProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    setFieldErrors({});

    // Basic validation
    const errors: Record<string, string[]> = {};
    
    if (!formData.email) {
      errors.email = ['Email is required'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ['Please enter a valid email'];
    }
    
    if (!formData.password) {
      errors.password = ['Password is required'];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await onSubmit(formData.email, formData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  return {
    formData,
    fieldErrors,
    handleSubmit,
    handleInputChange,
    getFieldError
  };
};
