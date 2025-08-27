import React from 'react';

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
        <button
          type="button"
          className="w-full bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-4 rounded-xl border border-stone-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-4 rounded-xl border border-stone-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Continue with GitHub
        </button>
      </div>
    </>
  );
};

export default SocialLogin;
