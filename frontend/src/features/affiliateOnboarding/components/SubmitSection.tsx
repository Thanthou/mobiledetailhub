import React from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { AffiliateApplication } from '../types';

interface SubmitSectionProps {
  isSubmitting: boolean;
  submitError: string | null;
  formData: AffiliateApplication;
  onSubmit: (e: React.FormEvent) => void;
  emergencyCleanup?: () => void;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isSubmitting,
  submitError,
  emergencyCleanup
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 font-semibold py-3 px-6 rounded-lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Submit Application
        </Button>
      </div>

      {submitError && (
        <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {emergencyCleanup && (
        <div className="mt-4 pt-4 border-t border-stone-600">
          <Button
            type="button"
            onClick={emergencyCleanup}
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-red-400"
            title="Clear all form data and localStorage (use if experiencing issues)"
          >
            Clear All Data (Emergency)
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubmitSection;
