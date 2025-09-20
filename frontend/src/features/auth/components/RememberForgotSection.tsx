import React from 'react';

import { Button } from '@/shared/ui';

interface RememberForgotSectionProps {
  disabled?: boolean;
}

const RememberForgotSection: React.FC<RememberForgotSectionProps> = ({ disabled = false }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          id="remember-me"
          name="remember-me"
          className="w-4 h-4 text-orange-500 bg-stone-950 border-stone-600 rounded focus:ring-orange-500 focus:ring-2"
          disabled={disabled}
          autoComplete="off"
        />
        <span className="text-sm text-gray-300 ml-2">Remember me</span>
      </label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-sm text-orange-400 hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed p-0 h-auto"
        disabled={disabled}
      >
        Forgot password?
      </Button>
    </div>
  );
};

export default RememberForgotSection;
