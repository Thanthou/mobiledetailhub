/**
 * Launch Overlay Component
 * 
 * Renders the countdown animation globally using React Portal.
 * This allows the countdown to work from any scroll position on the page.
 * 
 * Note: Rocket + Peel animations are now handled by RocketPeelTransition wrapper component
 * for better layering and content reveal.
 */

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LaunchOverlayProps {
  showCountdown: boolean;
  countdownNumber: number;
}

export function LaunchOverlay({
  showCountdown,
  countdownNumber,
}: LaunchOverlayProps) {
  // Render to document.body so it's not affected by scroll position
  return createPortal(
    <AnimatePresence>
      {showCountdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            key={countdownNumber}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1]
            }}
            exit={{
              scale: 1.5,
              opacity: 0
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.6, 1],
              ease: 'easeOut'
            }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 0.5,
                repeat: 1,
                ease: 'easeInOut'
              }}
              className="absolute -inset-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-[120px]"
            />
            <span className="relative text-[20rem] sm:text-[30rem] md:text-[40rem] font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {countdownNumber}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

