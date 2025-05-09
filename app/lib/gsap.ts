'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, MotionPathPlugin);
}

// Initialize smooth scrolling with Lenis
export const useSmoothScroll = () => {
  useEffect(() => {
    // Use type assertion to bypass TypeScript checking for Lenis options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Update ScrollTrigger when Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Setup a ticker for GSAP that uses Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);
};

// Helper to create scroll trigger animations
export const createScrollTrigger = (
  element: string | Element,
  animation: gsap.core.Timeline | gsap.core.Tween,
  options = {}
) => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    animation: animation,
    toggleActions: 'play none none reverse',
    ...options,
  });
};

export { gsap, ScrollTrigger, Flip, MotionPathPlugin }; 