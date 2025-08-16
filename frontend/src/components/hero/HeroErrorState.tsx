import React from 'react';

interface HeroErrorStateProps {
  error: string;
}

const HeroErrorState: React.FC<HeroErrorStateProps> = ({ error }) => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="text-center text-white">
        <p>Error loading hero: {error}</p>
      </div>
    </section>
  );
};

export default HeroErrorState;