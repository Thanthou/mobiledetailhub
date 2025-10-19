import React from 'react';

import { Button } from '@/shared/ui';

const SocialLogin: React.FC = () => {
  return (
    <>
      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-stone-600"></div>
        <div className="px-4 text-sm text-gray-500">or</div>
        <div className="flex-1 border-t border-stone-600"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full bg-stone-800 hover:bg-stone-700 font-medium py-3 px-4 rounded-xl border border-stone-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full bg-stone-800 hover:bg-stone-700 font-medium py-3 px-4 rounded-xl border border-stone-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Continue with GitHub
        </Button>
      </div>
    </>
  );
};

export default SocialLogin;
