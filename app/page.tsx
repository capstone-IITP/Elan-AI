'use client';

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import HowItWorksSection from './sections/HowItWorksSection';
import VisionMatchSection from './sections/VisionMatchSection';
import WhyElanAISection from './sections/WhyElanAISection';
import TrendingStylesSection from './sections/TrendingStylesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import MobileAppSection from './sections/MobileAppSection';
import NewsletterSection from './sections/NewsletterSection';
import { useSmoothScroll } from './lib/gsap';
import { createScrollAnimation, createParallaxEffect } from './lib/animations';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();
  
  // Set up global animations
  useEffect(() => {
    // Initialize scroll-triggered animations for common elements
    createScrollAnimation('.animate-on-scroll', { start: 'top 80%' });
    createScrollAnimation('.section-title', { 
      start: 'top 80%',
      onEnter: (batch: any) => console.log('Section title visible', batch)
    });
    
    // Create parallax effects for backgrounds
    createParallaxEffect('.parallax-bg', 0.15);
    
    // Scroll to top button visibility
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // Smooth scroll function with easing
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        // Using requestAnimationFrame for smoother animation
        window.requestAnimationFrame(scrollToTop);
        // Custom easing function for more natural feel
        window.scrollTo(0, c - c / 8);
      }
    };
    
    // Attach click handler to the button
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', scrollToTop);
    }
    
    const checkScrollPosition = () => {
      if (scrollToTopBtn) {
        if (window.scrollY > 500) {
          scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
          scrollToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        } else {
          scrollToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
          scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
      }
    };

    // Initialize scroll event listener
    window.addEventListener('scroll', checkScrollPosition);
    
    // Run once on initial load
    checkScrollPosition();
    
    // Handle cursor animation
    const cursor = document.createElement('div');
    cursor.className = 'animated-cursor fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference bg-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300';
    document.body.appendChild(cursor);

    // Track mouse movement
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.opacity = '0.7';
      // Add lag for smooth following effect
      setTimeout(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }, 50);
    };

    // Show/hide cursor
    const onMouseEnter = () => {
      cursor.style.opacity = '0.7';
    };

    const onMouseLeave = () => {
      cursor.style.opacity = '0';
    };
    
    // Handle cursor scale effect on clickable elements
    const handleCursorEffects = () => {
      const clickables = document.querySelectorAll('a, button, .clickable');
      clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('scale-150');
          cursor.classList.add('opacity-60');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('scale-150');
          cursor.classList.remove('opacity-60');
        });
      });
    };
    
    // Initialize cursor effects
    handleCursorEffects();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    // Clean up
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      if (scrollToTopBtn) {
        scrollToTopBtn.removeEventListener('click', scrollToTop);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <WhyElanAISection />
        <HowItWorksSection />
        <TrendingStylesSection />
        <VisionMatchSection />
        <TestimonialsSection />
        <MobileAppSection />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-primary/95 to-primary/90 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-acorn font-bold mb-6">
                Experience <span className="text-gradient">Virtual Try-On</span>
              </h2>
              
              <p className="text-xl text-white/70 mb-10">
                Create your account to access our exclusive AI-powered virtual try-on technology and transform your shopping experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?tab=login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-primary font-medium rounded-lg shadow-glow hover:shadow-glow-intense transition-all duration-300 w-full sm:w-auto"
                  >
                    Login
                  </motion.button>
                </Link>
                
                <Link href="/auth?tab=register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg shadow-accent-glow hover:shadow-accent-glow-intense transition-all duration-300 w-full sm:w-auto"
                  >
                    Create Account
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        
        <NewsletterSection />
        <Footer />

        {/* Scroll to top button */}
        <button 
          id="scrollToTopBtn" 
          className="fixed bottom-6 right-6 p-3 rounded-full bg-accent shadow-lg z-50 opacity-0 pointer-events-none transition-all duration-500 hover:bg-accent/90 hover:scale-110 hover:shadow-accent/30 hover:shadow-xl translate-y-10 transform pulse-animation"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6 text-white arrow-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </main>
    </>
  );
} 