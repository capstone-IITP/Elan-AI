'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import TextReveal from '../components/TextReveal';
import Typewriter from '../components/TypeWriter';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../lib/animations';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    const titleElement = titleRef.current;
    const textElement = textRef.current;
    const ctaElement = ctaRef.current;
    const imageContainerElement = imageContainerRef.current;
    const spotlightElement = spotlightRef.current;

    if (!heroElement || !titleElement || !textElement || !ctaElement || !imageContainerElement) return;

    // Shimmering effect on the heading with gradient text
    gsap.to('.shimmer-text', {
      backgroundPosition: '200% center',
      duration: 10,
      repeat: -1,
      ease: 'linear'
    });

    // Floating images animation with subtle movement - updated to maintain proper spacing
    gsap.to('.floating-image', {
      y: (i, target) => {
        // Get index to identify which image (0-3)
        const index = Array.from(document.querySelectorAll('.floating-image')).indexOf(target);
        // Different movement ranges for top vs bottom images
        if (index === 0 || index === 1) { // Top images
          return `random(-8, 8)`;
        } else { // Bottom images
          return `random(-5, 5)`;
        }
      },
      x: (i) => `random(-5, 5)`,
      rotation: (i) => `random(-2, 2)`,
      duration: 3,
      ease: 'sine.inOut',
      stagger: {
        each: 0.5,
        repeat: -1,
        yoyo: true
      }
    });

    // Set up scroll-triggered parallax for images with constrained movement
    gsap.to('.floating-image', {
      y: (index, target) => {
        // Different parallax effects based on image position
        const position = Array.from(document.querySelectorAll('.floating-image')).indexOf(target);
        // Smaller movement for right side images to maintain spacing
        if (position === 1 || position === 3) {
          return 15 + (position * 10); // Right side images
        }
        return 20 + (position * 15); // Left side images
      },
      ease: 'none',
      scrollTrigger: {
        trigger: heroElement,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Spotlight subtle pulsing
    if (spotlightElement) {
      gsap.to(spotlightElement, {
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    return () => {
      // Clean up animations if needed
    };
  }, []);

  // Animation variants for hero content
  const heroCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const typingPhrases = [
    "Elevate your wardrobe",
    "Discover your style",
    "Transform your look"
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary to-primary/90 text-white pt-20"
      id="hero"
    >
      {/* Enhanced background with better gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,61,0,0.25)_0,_rgba(16,16,16,0)_70%)]"></div>
      </div>

      {/* Spotlight effect behind content */}
      <div
        ref={spotlightRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] rounded-full blur-[120px] bg-accent/40 opacity-80 z-10"
      ></div>

      {/* Hero content with improved readability */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          className="text-center max-w-4xl mx-auto backdrop-blur-md bg-black/20 p-6 sm:p-8 rounded-2xl"
          variants={heroCardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-acorn font-bold mb-4 sm:mb-6 tracking-tight"
          >
            <TextReveal
              text="The Future of Fashion"
              className="shimmer-text block mb-2 bg-gradient-to-r from-white via-white/90 to-white bg-size-200 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
              stagger={0.04}
              delay={0.3}
            />
            <TextReveal
              text="Your Personal AI Stylist"
              className="shimmer-text block mb-2 bg-[linear-gradient(90deg,#FF3D00,#FF9E80)] bg-size-200 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
              stagger={0.04}
              delay={0.8}
            />
            <Typewriter
              text={typingPhrases}
              className="text-gradient drop-shadow-[0_2px_8px_rgba(255,61,0,0.5)] block mt-4"
              speed={60}
              delay={2000}
              loop={true}
            />
          </h1>

          <AnimatedElement
            variants={fadeInUp}
            delay={1.2}
            className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto"
          >
            <p className="drop-shadow-md" ref={textRef}>
              Discover perfect outfits curated by AI, try them on virtually, and shop with confidence. No more fashion dilemmas or fitting room disappointments.
            </p>
          </AnimatedElement>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimatedElement variants={fadeInLeft} delay={1.5}>
              <motion.a
                href="#try-on"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 61, 0, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-accent text-white px-6 sm:px-8 py-3 rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-accent/40 transition-all duration-300 w-full sm:w-auto"
              >
                Try the Virtual Stylist
              </motion.a>
            </AnimatedElement>
            <AnimatedElement variants={fadeInRight} delay={1.7}>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-white/50 bg-white/10 text-white px-6 sm:px-8 py-3 rounded-full font-medium text-base sm:text-lg hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
              >
                How It Works
              </motion.a>
            </AnimatedElement>
          </div>
        </motion.div>
      </div>

      {/* Floating images - now with higher z-index to appear over the glassmorphism */}
      <div ref={imageContainerRef} className="absolute inset-0 pointer-events-none z-30">
        {/* Top left image - moved lower to avoid navbar area */}
        <motion.div
          className="floating-image absolute top-[18%] sm:top-[16%] md:top-[15%] left-[5%] md:left-[8%] w-32 sm:w-40 md:w-48 h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.4),0_10px_20px_-10px_rgba(0,0,0,0.3)]"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent mix-blend-overlay"></div>
          <Image
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b"
            alt="Fashion model"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        {/* Top right image - moved lower to avoid navbar area */}
        <motion.div
          className="floating-image absolute top-[20%] sm:top-[18%] md:top-[16%] right-[5%] md:right-[8%] w-36 sm:w-44 md:w-56 h-52 sm:h-60 md:h-72 rounded-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.4),0_10px_20px_-10px_rgba(0,0,0,0.3)]"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "backOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent mix-blend-overlay"></div>
          <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
            alt="Fashion outfit - floral dress"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        {/* Bottom left image */}
        <motion.div
          className="floating-image absolute bottom-[15%] left-[8%] md:left-[12%] w-32 sm:w-40 md:w-52 h-48 sm:h-56 md:h-68 rounded-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.4),0_10px_20px_-10px_rgba(0,0,0,0.3)] hidden sm:block"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "backOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent mix-blend-overlay"></div>
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae"
            alt="Fashion styling"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        {/* Bottom right image - significantly adjusted position to avoid overlap with top right image */}
        <motion.div
          className="floating-image absolute bottom-[5%] sm:bottom-[6%] md:bottom-[7%] right-[8%] md:right-[15%] w-28 sm:w-36 md:w-44 h-40 sm:h-48 md:h-60 rounded-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.4),0_10px_20px_-10px_rgba(0,0,0,0.3)] hidden sm:block"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "backOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent mix-blend-overlay"></div>
          <Image
            src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc"
            alt="Virtual fashion - red outfit"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [0.2, 1, 0.2]
          }}

          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center p-2 bg-white/5"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 rounded-full bg-white"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 