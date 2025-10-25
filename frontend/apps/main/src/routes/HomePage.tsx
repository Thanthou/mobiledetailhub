import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb } from 'lucide-react';

import Header from '../components/Header';
import ValueSection from '../components/sections/ValueSection';
import PreviewSection from '../components/sections/PreviewSection';
import PricingSection from '../components/sections/PricingSection';
import ContactSection from '../components/sections/ContactSection';
import { LaunchOverlay } from '../components/LaunchOverlay';
import { RocketPeelTransition } from '../components/RocketPeelTransition';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useLaunchAnimation } from '../hooks/useLaunchAnimation';

// Lazy load the onboarding page - only loads when needed
const TenantApplicationPage = lazy(() => import('@main/components/tenantOnboarding/components/TenantApplicationPage'));

export function HomePage() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Track which section is currently in view
  const activeSection = useScrollSpy(['top', 'advantage', 'preview', 'pricing', 'contact'], scrollContainerRef);

  // Use shared launch animation hook
  const {
    handleLaunch: handleLaunchClick,
    showCountdown,
    countdownNumber,
    showTransition,
    handleTransitionComplete,
    shouldLoadOnboarding,
  } = useLaunchAnimation();

  return (
    <div ref={scrollContainerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {/* Global Countdown Overlay via Portal */}
      <LaunchOverlay 
        showCountdown={showCountdown}
        countdownNumber={countdownNumber}
      />
      
      <Header onGetStarted={handleLaunchClick} activeSection={activeSection} scrollContainerRef={scrollContainerRef} />
      
      {/* Hero Section */}
      <div id="top" className="relative w-full h-screen overflow-hidden snap-start snap-always">
        {/* Layer 2 (bottom): Onboarding page - lazy loaded underneath, revealed by peel */}
        {shouldLoadOnboarding && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
              </div>
            }>
              <TenantApplicationPage />
            </Suspense>
          </div>
        )}
      
        {/* Layer 1 (top): Hero page - wrapped in RocketPeelTransition */}
        <div className="absolute inset-0 z-10">
          <RocketPeelTransition
            isActive={showTransition}
            onComplete={handleTransitionComplete}
          >
            <motion.div className="w-full h-full bg-gray-950">
        {/* Gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
          }}
        />

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 px-4">
          {/* Icon with rocket and lightbulb */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-30" />

            <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full">
              <Rocket className="text-white" size={40} />
              <Lightbulb className="text-yellow-300 absolute -top-2 -right-2" size={24} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.8,
              type: 'spring',
              stiffness: 100
            }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white text-center"
          >
            Now this is{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Smart
            </span>
            .
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.2,
              duration: 0.8,
              type: 'spring',
              stiffness: 100
            }}
            className="text-2xl md:text-3xl lg:text-4xl text-gray-300 text-center max-w-3xl font-light"
          >
            Clean. Clear. Conversion-ready.
          </motion.p>

          {/* Launch button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.6,
              duration: 0.6,
              type: 'spring',
              stiffness: 200
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLaunchClick}
            className="mt-4 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-shadow"
          >
            Launch Yours in Minutes
          </motion.button>

          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 text-gray-500 text-sm"
          >
            No contract. No setup fees. Just smart.
          </motion.div>
        </div>

        {/* Floating gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
            </motion.div>
          </RocketPeelTransition>
        </div>
      </div>

      {/* Marketing Sections */}
      
      {/* Features Section - Same pattern as Hero */}
      <div id="advantage" className="relative w-full h-screen overflow-hidden snap-start snap-always">
        {/* Layer 2 (bottom): Onboarding page - lazy loaded underneath, revealed by peel */}
        {shouldLoadOnboarding && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
              </div>
            }>
              <TenantApplicationPage />
            </Suspense>
          </div>
        )}
      
        {/* Layer 1 (top): Features page - wrapped in RocketPeelTransition */}
        <div className="absolute inset-0 z-10">
          <RocketPeelTransition
            isActive={showTransition}
            onComplete={handleTransitionComplete}
          >
            <ValueSection />
          </RocketPeelTransition>
        </div>
      </div>
      
      {/* Preview Section - Same pattern as Hero */}
      <div id="preview" className="relative w-full h-screen overflow-hidden snap-start snap-always">
        {/* Layer 2 (bottom): Onboarding page - lazy loaded underneath, revealed by peel */}
        {shouldLoadOnboarding && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
              </div>
            }>
              <TenantApplicationPage />
            </Suspense>
          </div>
        )}
      
        {/* Layer 1 (top): Preview page - wrapped in RocketPeelTransition */}
        <div className="absolute inset-0 z-10">
          <RocketPeelTransition
            isActive={showTransition}
            onComplete={handleTransitionComplete}
          >
            <PreviewSection />
          </RocketPeelTransition>
        </div>
      </div>
      
      {/* Pricing Section - Same pattern as Hero */}
      <div id="pricing" className="relative w-full h-screen overflow-hidden snap-start snap-always">
        {/* Layer 2 (bottom): Onboarding page - lazy loaded underneath, revealed by peel */}
        {shouldLoadOnboarding && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
              </div>
            }>
              <TenantApplicationPage />
            </Suspense>
          </div>
        )}
      
        {/* Layer 1 (top): Pricing page - wrapped in RocketPeelTransition */}
        <div className="absolute inset-0 z-10">
          <RocketPeelTransition
            isActive={showTransition}
            onComplete={handleTransitionComplete}
          >
            <PricingSection onGetStarted={handleLaunchClick} />
          </RocketPeelTransition>
        </div>
      </div>
      
      {/* Contact Section - Same pattern as Hero */}
      <div id="contact" className="relative w-full h-screen overflow-hidden snap-start snap-always">
        {/* Layer 2 (bottom): Onboarding page - lazy loaded underneath, revealed by peel */}
        {shouldLoadOnboarding && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
              </div>
            }>
              <TenantApplicationPage />
            </Suspense>
          </div>
        )}
      
        {/* Layer 1 (top): Contact page - wrapped in RocketPeelTransition */}
        <div className="absolute inset-0 z-10">
          <RocketPeelTransition
            isActive={showTransition}
            onComplete={handleTransitionComplete}
          >
            <ContactSection onGetStarted={handleLaunchClick} />
          </RocketPeelTransition>
        </div>
      </div>
    </div>
  );
}
