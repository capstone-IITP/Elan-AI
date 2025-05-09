'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import type { Variants } from 'framer-motion';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Standard easing - matches cubic-bezier(0.4, 0, 0.2, 1)
export const standardEasing = [0.4, 0, 0.2, 1];

// Detect reduced motion preference
export const prefersReducedMotion = typeof window !== 'undefined' ? 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

// Duration settings
export const durations = {
  short: 0.3,
  medium: 0.5,
  standard: 0.8,
  long: 1.2
};

// Framer Motion variants for common animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.standard, 
      ease: standardEasing
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.standard, 
      ease: standardEasing
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: durations.standard, 
      ease: standardEasing
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: durations.standard, 
      ease: standardEasing
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export const staggerFadeInUp: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.standard,
      ease: standardEasing
    }
  }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: durations.medium, 
      ease: standardEasing
    }
  }
};

export const clipPathReveal: Variants = {
  hidden: { 
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0
  },
  visible: { 
    clipPath: 'inset(0 0 0 0)',
    opacity: 1,
    transition: { 
      duration: durations.standard,
      ease: standardEasing
    }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: durations.standard,
      ease: standardEasing
    }
  }
};

export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { 
      duration: durations.short, 
      ease: "easeOut" 
    }
  },
  tap: { 
    scale: 0.97,
    transition: { 
      duration: 0.15, 
      ease: "easeIn" 
    }
  }
};

export const imageHover: Variants = {
  rest: { 
    scale: 1,
    filter: "brightness(1)" 
  },
  hover: { 
    scale: 1.05,
    filter: "brightness(1.1)",
    transition: { 
      duration: durations.medium,
      ease: standardEasing
    }
  }
};

export const cardHover: Variants = {
  rest: { 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" 
  },
  hover: { 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: durations.short,
      ease: standardEasing
    }
  },
  tap: {
    y: -2,
    transition: { 
      duration: 0.1,
      ease: "easeIn" 
    }
  }
};

export const navLinkHover: Variants = {
  rest: { 
    backgroundSize: '0% 2px',
    backgroundPosition: '0% 100%',
    backgroundRepeat: 'no-repeat'
  },
  hover: { 
    backgroundSize: '100% 2px',
    transition: { 
      duration: durations.short,
      ease: standardEasing
    }
  }
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: standardEasing
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.short,
      ease: standardEasing
    }
  }
};

// GSAP ScrollTrigger utilities
export const createScrollAnimation = (selector: string, options = {}) => {
  if (prefersReducedMotion) return;
  
  const elements = gsap.utils.toArray(selector);
  
  elements.forEach((element: any) => {
    gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: durations.standard,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
          ...options
        }
      }
    );
  });
};

// Text typing animation
export const typewriterAnimation = (element: HTMLElement, text: string, speed = 50) => {
  if (prefersReducedMotion) {
    element.textContent = text;
    return;
  }
  
  let i = 0;
  element.textContent = '';
  
  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  
  typeWriter();
};

// Counter animation
export const animateCounter = (element: HTMLElement, start = 0, end = 100, duration = 2000) => {
  if (prefersReducedMotion) {
    element.textContent = end.toString();
    return;
  }
  
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toString();
    }
  };
  window.requestAnimationFrame(step);
};

// Parallax effect for elements
export const createParallaxEffect = (selector: string, strength = 0.2) => {
  if (prefersReducedMotion) return;
  
  const elements = gsap.utils.toArray(selector);
  
  elements.forEach((element: any) => {
    gsap.to(element, {
      y: `${-strength * 100}%`,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement || element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
};

// Smooth scroll function with GSAP
export const smoothScrollTo = (id: string, offset = 80, duration = 1) => {
  const element = document.getElementById(id);
  if (element) {
    gsap.to(window, {
      duration: prefersReducedMotion ? 0.1 : duration,
      scrollTo: {
        y: `#${id}`,
        offsetY: offset
      },
      ease: "power3.inOut"
    });
  }
};

// Create staggered scroll animations
export const createStaggeredScrollAnimation = (containerSelector: string, itemSelector: string, options = {}) => {
  if (prefersReducedMotion) return;
  
  const containers = gsap.utils.toArray(containerSelector);
  
  containers.forEach((container: any) => {
    const items = container.querySelectorAll(itemSelector);
    
    gsap.fromTo(
      items,
      { 
        y: 50, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: durations.standard,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse",
          ...options
        }
      }
    );
  });
};

// ScrollTrigger batch for efficient scroll animations
export const createScrollBatch = (selector: string, batchOptions = {}, animationOptions = {}) => {
  if (prefersReducedMotion) return;
  
  ScrollTrigger.batch(selector, {
    interval: 0.1,
    batchMax: 4,
    onEnter: (batch) => 
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: durations.standard,
        ...animationOptions
      }),
    onLeave: (batch) => 
      gsap.set(batch, {
        opacity: 0,
        y: -20,
      }),
    onEnterBack: (batch) => 
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: durations.standard,
        ...animationOptions
      }),
    onLeaveBack: (batch) => 
      gsap.set(batch, {
        opacity: 0,
        y: 20,
      }),
    ...batchOptions
  });
}; 