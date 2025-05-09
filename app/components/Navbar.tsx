'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { prefersReducedMotion, navLinkHover, smoothScrollTo } from '../lib/animations';

// Register ScrollToPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useAuth();
  const controls = useAnimation();

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);

    const darkModeListener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', darkModeListener);

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Detect scroll direction and hide/show navbar
    if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
      // Scrolling down - hide navbar
      setIsVisible(false);
    } else {
      // Scrolling up - show navbar
      setIsVisible(true);
    }

    // Update last scroll position
    lastScrollY.current = currentScrollY;

    // Check if we've scrolled past the threshold
    setIsScrolled(currentScrollY > 50);

    // Update active section based on scroll position
    const sections = ['how-it-works', 'try-on', 'trends', 'pricing', 'waitlist'];
    const currentSection = sections.find(section => {
      const element = document.getElementById(section);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top <= 200 && rect.bottom >= 200;
    });

    if (currentSection) {
      setActiveSection(currentSection);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial animation on mount
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    });

    // Pulse animation for navbar when scrolled
    let pulseInterval: NodeJS.Timeout | null = null;
    if (isScrolled && !isDarkMode) {
      // Subtle pulse animation
      pulseInterval = setInterval(() => {
        const navbar = document.querySelector('.navbar-sticky');
        if (navbar) {
          gsap.to(navbar, {
            boxShadow: '0 10px 20px -3px rgba(255, 61, 0, 0.25), 0 4px 6px -4px rgba(255, 61, 0, 0.15), 0 0 0 1px rgba(255, 61, 0, 0.05)',
            duration: 1.5,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }, 4000); // Pulse every 4 seconds
    }

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (pulseInterval) clearInterval(pulseInterval);
    };
  }, [controls, handleScroll, isScrolled, isDarkMode]);

  // Smooth scroll function
  const scrollToSection = (id: string, isMobile = false) => {
    const element = document.getElementById(id);
    if (element) {
      // Close mobile menu if needed
      if (isMobile) {
        setIsMenuOpen(false);
      }

      // Use smoothScrollTo from our animation library
      smoothScrollTo(id, 80);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Blur background effect when scrolled
  const blurBgVariants = {
    transparent: {
      backdropFilter: "blur(0px)",
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
    },
    blurred: {
      backdropFilter: "blur(8px)",
      backgroundColor: isDarkMode ? "rgba(16, 16, 16, 0.85)" : "rgba(255, 255, 255, 0.85)",
      boxShadow: isDarkMode
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
        : "0 10px 15px -3px rgba(255, 61, 0, 0.2), 0 4px 6px -4px rgba(255, 61, 0, 0.1), 0 0 0 1px rgba(255, 61, 0, 0.05)"
    }
  };

  // Scale and color transition on hover
  const linkHoverVariants = {
    rest: {
      scale: 1,
      color: "rgb(var(--foreground-rgb))",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    hover: {
      scale: 1.05,
      color: "var(--accent-color)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 navbar-sticky} ${isScrolled ? 'navbar-accent-shadow' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={controls}
    >
      <motion.div
        className="w-full h-full"
        variants={blurBgVariants}
        initial="transparent"
        animate={isScrolled ? "blurred" : "transparent"}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
          backgroundColor: {
            delay: isScrolled ? 0 : 0.1,
            duration: 0.3
          },
          backdropFilter: {
            delay: isScrolled ? 0 : 0.1,
            duration: 0.3
          }
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Acorn]">
                <span className="text-gradient">Élan</span> AI
              </h1>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Features', 'How It Works', 'Pricing'].map((item, index) => {
              const href = item === 'Home' ? '/' : `#${item.toLowerCase().replace(/\s+/g, '-')}`;
              const isActive = item.toLowerCase().replace(/\s+/g, '-') === activeSection;

              return (
                <NavLink key={index} href={href} isActive={isActive}>
                  {item}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button variant="secondary" onClick={logout}>
                    Sign Out
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/auth">
                    <Button variant="outline" className='hover:bg-gradient-to-t from-accent/30 to-transparent hover:text-white'>Sign In</Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button>Sign Up</Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden absolute top-4 right-4">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md focus:outline-none text-gray-900 dark:text-white"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 7, width: '24px' } : { rotate: 0, y: 0, width: '24px' }}
                className={`block h-0.5 rounded-full bg-current transition-all duration-300`}
              ></motion.span>
              <motion.span
                animate={isMenuOpen ? { opacity: 0, width: '0px' } : { opacity: 1, width: '16px' }}
                className={`block h-0.5 rounded-full bg-current transition-all duration-300`}
              ></motion.span>
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -7, width: '24px' } : { rotate: 0, y: 0, width: '24px' }}
                className={`block h-0.5 rounded-full bg-current transition-all duration-300`}
              ></motion.span>
            </div>
          </button>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden px-4 pb-4 fixed top-16 left-0 right-0 z-50"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="glass-card mx-4 mb-4 p-4 rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  boxShadow: isDarkMode
                    ? "0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -2px rgba(0, 0, 0, 0.3)"
                    : "0 8px 20px -4px rgba(0, 0, 0, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.15)"
                }}
              >
                {['How It Works', 'Try On', 'Trends', 'Pricing'].map((item, index) => {
                  const lowercaseId = item.toLowerCase().replace(/\s+/g, '-');
                  const isActive = activeSection === lowercaseId;

                  return (
                    <motion.a
                      href={`#${lowercaseId}`}
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(lowercaseId, true);
                      }}
                      className={`block py-3 text-base font-medium hover:text-accent transition-colors duration-300 text-white
                      ${isActive ? 'text-accent' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item}
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  // Skip the complex animation for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <Link href={href} className={`nav-item ${isActive ? 'nav-item-active' : ''}`}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} passHref>
      <motion.span
        className={`nav-item text-gray-700 dark:text-gray-300 cursor-pointer ${isActive ? 'text-accent-color' : ''}`}
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={navLinkHover}
        style={{
          backgroundImage: 'linear-gradient(var(--accent-color), var(--accent-color))',
          backgroundSize: isActive ? '100% 2px' : '0% 2px',
          backgroundPosition: '0 100%',
          backgroundRepeat: 'no-repeat',
          paddingBottom: '2px'
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

export default Navbar; 