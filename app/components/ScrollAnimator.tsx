'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { prefersReducedMotion } from '../lib/animations';

interface ScrollAnimatorProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'zoom-in' | 'none';
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
  id?: string;
}

const animations = {
  'fade-up': {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  'fade-down': {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  'fade-left': {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  'fade-right': {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  'scale-up': {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  'zoom-in': {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  'none': {
    hidden: {},
    visible: {}
  }
};

// Child animation variants for staggered animation
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ScrollAnimator({
  children,
  animation = 'fade-up',
  threshold = 0.1,
  delay = 0,
  duration = 0.7, 
  className = '',
  once = true,
  staggerChildren = false,
  staggerDelay = 0.1,
  id
}: ScrollAnimatorProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  // Skip animation for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);

  // For staggered children animation
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  // For regular animation
  const regularAnimation = {
    hidden: animations[animation].hidden,
    visible: {
      ...animations[animation].visible,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  if (staggerChildren) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className={className}
        id={id}
      >
        {Array.isArray(children) ? 
          children.map((child, index) => (
            <motion.div key={index} variants={childVariants} 
              transition={{ duration, ease: [0.4, 0, 0.2, 1] }}>
              {child}
            </motion.div>
          ))
          : 
          <motion.div variants={childVariants} 
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}>
            {children}
          </motion.div>
        }
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={regularAnimation}
      className={className}
      id={id}
    >
      {children}
    </motion.div>
  );
} 