import React from 'react';

const HeroLoadingState: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading hero...</p>
      </div>
    </section>
  );
};

export default HeroLoadingState;