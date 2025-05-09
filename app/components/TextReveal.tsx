'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface TextRevealProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

const TextReveal = ({
  text,
  children,
  className = '',
  stagger = 0.02,
  duration = 0.5,
  delay = 0,
  once = true,
  threshold = 0.1,
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  // Use either provided text or children
  const content = text || (typeof children === 'string' ? children : '');
  
  // Handle when children is provided but not a string
  if (!content && children) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    );
  }
  
  // Split text into words
  const words = content.split(' ');
  
  // Animation variants
  const container: Variants = {
    hidden: {},
    visible: (i = 1) => ({
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    }),
  };
  
  const child: Variants = {
    hidden: {
      y: 40,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
  };
  
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block mr-1">
          <motion.span
            className="inline-block overflow-hidden"
            variants={child}
          >
            {word}
          </motion.span>
          {index !== words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal; 