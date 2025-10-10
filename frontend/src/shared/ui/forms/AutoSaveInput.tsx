import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

/**
 * Generic auto-save input component with visual feedback
 * 
 * Features:
 * - Green checkmark when value is saved
 * - Blue spinning loader while saving
 * - Red alert icon on error
 * - "Saving..." text below field during save
 * - Error message display
 */

interface AutoSaveInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date';
  value: string;
  onChange: (value: string) => void;
  isSaving: boolean;
  error: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AutoSaveInput: React.FC<AutoSaveInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  isSaving,
  error,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getStatusIcon = () => {
    if (isSaving) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (value && value.trim() !== '') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 pr-10 border rounded-md bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-stone-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getStatusIcon()}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {isSaving && (
        <p className="mt-1 text-sm text-blue-400">Saving...</p>
      )}
    </div>
  );
};

