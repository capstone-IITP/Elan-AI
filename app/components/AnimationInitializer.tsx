'use client';

import { useEffect } from 'react';
import { setupAnimations } from '../lib/setupAnimations';

export default function AnimationInitializer() {
  useEffect(() => {
    // Initialize animations on component mount
    setupAnimations();
    
    // Re-initialize animations when route changes (when using Next.js)
    const handleRouteChange = () => {
      setTimeout(() => {
        setupAnimations();
      }, 100);
    };
    
    window.addEventListener('routeChangeComplete', handleRouteChange);
    
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange);
    };
  }, []);
  
  // This is a utility component that doesn't render anything
  return null;
} 