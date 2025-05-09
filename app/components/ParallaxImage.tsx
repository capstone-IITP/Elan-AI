'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { prefersReducedMotion } from '../lib/animations';

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  parallaxStrength?: number;
  hoverEffect?: 'zoom' | 'tilt' | 'both' | 'none';
  objectFit?: 'cover' | 'contain' | 'fill';
  glassmorphism?: boolean;
}

const ParallaxImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  parallaxStrength = 0.1,
  hoverEffect = 'zoom',
  objectFit = 'cover',
  glassmorphism = false
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Skip effects for reduced motion preference
  const shouldReduceMotion = prefersReducedMotion;

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, shouldReduceMotion ? 0 : parallaxStrength * 100]
  );

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current || !isHovered || shouldReduceMotion) return;
      
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, shouldReduceMotion]);

  // Transform values for tilt effect
  const rotateX = useTransform(
    () => (isHovered && !shouldReduceMotion && (hoverEffect === 'tilt' || hoverEffect === 'both')) 
      ? (mousePosition.y - 0.5) * -10 
      : 0
  );
  
  const rotateY = useTransform(
    () => (isHovered && !shouldReduceMotion && (hoverEffect === 'tilt' || hoverEffect === 'both')) 
      ? (mousePosition.x - 0.5) * 10 
      : 0
  );

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${glassmorphism ? 'glassmorphism' : ''} ${className}`}
      style={{ y }}
      whileHover={
        shouldReduceMotion || hoverEffect === 'none' 
          ? {} 
          : { 
              scale: hoverEffect === 'zoom' || hoverEffect === 'both' ? 1.02 : 1,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          width: '100%', 
          height: '100%',
          position: 'relative'
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`transition-all duration-500 h-full w-full ${
            (hoverEffect === 'zoom' || hoverEffect === 'both') && !shouldReduceMotion 
              ? 'hover:scale-110' 
              : ''
          }`}
          style={{ 
            objectFit,
            transformStyle: 'preserve-3d', 
            transform: 'translateZ(0)'
          }}
        />
        
        {/* Optional glassmorphism hover overlay */}
        {glassmorphism && (
          <motion.div 
            className="absolute inset-0 bg-black/0 backdrop-blur-[0px]"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 0.2, 
              backdropFilter: 'blur(2px)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxImage; 