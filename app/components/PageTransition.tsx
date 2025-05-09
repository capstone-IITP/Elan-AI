'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion, pageTransition } from '../lib/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // If user prefers reduced motion, skip the animation
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  useEffect(() => {
    // When route changes, show loading state
    setIsLoading(true);
    
    // Short timeout to allow animation to play
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="loader-dot-pulse" aria-label="Loading">
                <div className="w-2 h-2 bg-accent rounded-full mx-1 animate-dot-pulse1"></div>
                <div className="w-2 h-2 bg-accent rounded-full mx-1 animate-dot-pulse2"></div>
                <div className="w-2 h-2 bg-accent rounded-full mx-1 animate-dot-pulse3"></div>
              </div>
            </div>
          </div>
        ) : (
          displayChildren
        )}
      </motion.div>
    </AnimatePresence>
  );
} 