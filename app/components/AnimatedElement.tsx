'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { fadeInUp } from '../lib/animations';

interface AnimatedElementProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

const AnimatedElement = ({
  children,
  variants = fadeInUp,
  className = '',
  delay = 0,
  duration,
  threshold = 0.1,
  once = true,
}: AnimatedElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Customize transition if duration is provided
  const customVariants = duration
    ? {
        ...variants,
        visible: {
          ...(variants?.visible || {}),
          transition: {
            ...((variants?.visible as any)?.transition || {}),
            duration,
            delay,
          },
        },
      }
    : {
        ...variants,
        visible: {
          ...(variants?.visible || {}),
          transition: {
            ...((variants?.visible as any)?.transition || {}),
            delay,
          },
        },
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement; 