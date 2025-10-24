/**
 * Rocket Peel Transition Component
 * 
 * A reusable wrapper that applies rocket launch + page peel transition to its children.
 * The peel reveals content underneath (like the next page/section).
 * 
 * Usage:
 * <RocketPeelTransition isActive={showTransition} onComplete={() => navigate('/next')}>
 *   <YourContent />
 * </RocketPeelTransition>
 * 
 * Key features:
 * - Wraps content instead of using portal (better for layering)
 * - Peel and rocket are synced in same AnimatePresence
 * - Reveals underlying content as peel progresses
 * - Modular and reusable across any section/page
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { ReactNode } from 'react';

interface RocketPeelTransitionProps {
  isActive: boolean;
  children: ReactNode;
  onComplete?: () => void;
  rocketSize?: number;
  rocketRotation?: number;
  peelDuration?: number;
  rocketDuration?: number;
}

export function RocketPeelTransition({
  isActive,
  children,
  onComplete,
  rocketSize = 240,
  rocketRotation = -45,
  peelDuration = 2,
  rocketDuration = 2,
}: RocketPeelTransitionProps) {
  return (
    <div className="relative w-full h-full">
      {/* Content with peel effect - clips away from bottom to top */}
      <motion.div
        className="relative w-full h-full"
        initial={{ clipPath: 'inset(0 0 0 0)' }}
        animate={isActive ? { clipPath: 'inset(0 0 100% 0)' } : { clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: peelDuration, ease: 'linear' }}
        onAnimationComplete={() => {
          if (isActive && onComplete) {
            onComplete();
          }
        }}
      >
        {children}
      </motion.div>

      {/* Rocket overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '-100vh' }}
            exit={{ y: '-100vh' }}
            transition={{
              duration: rocketDuration,
              ease: 'linear'
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <Rocket
              className="text-white"
              size={rocketSize}
              style={{ transform: `rotate(${rocketRotation}deg)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

