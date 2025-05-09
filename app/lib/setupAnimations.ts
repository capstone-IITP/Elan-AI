'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { prefersReducedMotion, createScrollBatch, createScrollAnimation } from './animations';

// Initialize all animations for the entire site
export function setupAnimations() {
  if (typeof window === 'undefined') return;
  
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
  // Skip animation setup if user prefers reduced motion
  if (prefersReducedMotion) return;
  
  // Initialize ScrollTrigger refresh on page load
  ScrollTrigger.refresh();
  
  // Common elements batches - more performant than individual animations
  createScrollBatch('.animate-on-scroll', 
    { 
      interval: 0.1,
      batchMax: 5,
    }, 
    {
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }
  );
  
  // Fade in images with slight delay
  createScrollBatch('.parallax-image, img.fade-in, .fade-in-image', 
    { 
      interval: 0.1,
      batchMax: 3, 
    }, 
    {
      y: 0,
      duration: 1,
      ease: 'power2.out',
    }
  );
  
  // Initialize cards animations on scroll with stagger
  document.querySelectorAll('.cards-container').forEach((container) => {
    gsap.from(container.querySelectorAll('.card'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
      },
    });
  });
  
  // Animate counters/stats on scroll
  document.querySelectorAll('.animate-counter').forEach((counter) => {
    const target = counter.getAttribute('data-target');
    
    if (target) {
      const targetValue = parseInt(target, 10);
      
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(counter, 
            { innerText: 0 },
            { 
              innerText: targetValue, 
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                counter.innerHTML = Math.ceil(this.targets()[0].innerText).toString();
              } 
            }
          );
        },
        once: true
      });
    }
  });
  
  // Initialize text reveal animation on scroll
  document.querySelectorAll('.text-reveal-container').forEach((container) => {
    const textElements = container.querySelectorAll('.text-reveal');
    
    gsap.from(textElements, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
      },
    });
  });
  
  // Navbar animation
  const navbar = document.querySelector('.navbar-sticky');
  if (navbar) {
    let lastScrollY = window.scrollY;
    let animationFrame: number | null = null;
    
    const onScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        
        if (direction === 'down' && scrollY > 150) {
          navbar.classList.add('hidden');
          navbar.classList.remove('visible');
        } else {
          navbar.classList.add('visible');
          navbar.classList.remove('hidden');
        }
        
        lastScrollY = scrollY;
        animationFrame = null;
      });
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

export default setupAnimations; 