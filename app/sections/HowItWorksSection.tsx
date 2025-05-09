'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import TextReveal from '../components/TextReveal';
import { fadeInUp, fadeInLeft, fadeInRight, scaleUp } from '../lib/animations';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// How It Works steps data
const steps = [
  {
    id: 1,
    title: 'Upload Wardrobe',
    description: 'Take photos of your clothes or upload your existing wardrobe. Our AI will analyze and catalog everything automatically.',
    icon: '📸',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 2,
    title: 'AI Generates Outfits',
    description: 'Based on your style preferences, occasion, and weather, our AI creates perfect outfit combinations that work for you.',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: 'Try On Look',
    description: 'See how outfits look on your body with our virtual try-on technology. Compare options without changing clothes.',
    icon: '👗',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 4,
    title: 'Shop or Share',
    description: 'Love the look? Shop missing pieces instantly or share your outfit on social media with just one click.',
    icon: '🛍️',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
    color: 'from-emerald-500 to-green-500'
  }
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const triggerElement = triggerRef.current;
    const panelsElement = panelsRef.current;
    const headingElement = headingRef.current;
    
    if (!sectionElement || !triggerElement || !panelsElement) return;
    
    const panels = gsap.utils.toArray<HTMLElement>('.panel');
    
    // Create horizontal scroll effect
    const mainAnimation = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + Math.min(panelsElement.offsetWidth, window.innerWidth * 3),
        invalidateOnRefresh: true,
        id: "panelsContainer",
        onEnter: () => {
          if (headingElement) {
            gsap.to(headingElement, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out"
            });
          }
        }
      }
    });
    
    // Animate elements within each panel
    panels.forEach((panel, i) => {
      // Only animate when the panel comes into view
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: mainAnimation,
        start: "left center",
        onEnter: () => {
          gsap.to(panel.querySelector('.step-content'), {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          });
          gsap.to(panel.querySelector('.step-image'), {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.2
          });
        },
        onLeaveBack: () => {
          gsap.to(panel.querySelector('.step-content'), {
            y: 50,
            opacity: 0.5,
            duration: 0.8
          });
          gsap.to(panel.querySelector('.step-image'), {
            scale: 0.9,
            opacity: 0.7,
            duration: 1
          });
        }
      });
    });
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="how-it-works"
      className="relative bg-primary text-white overflow-hidden"
    >
      <div ref={triggerRef} className="h-screen bg-primary overflow-hidden">
        <div className="absolute left-0 top-0 w-full py-24 px-4 sm:px-6 z-20 bg-gradient-to-b from-primary via-primary to-transparent">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <h2 
              ref={headingRef}
              className="text-4xl md:text-5xl font-acorn font-bold text-center mb-4"
            >
              <TextReveal text="How It">
                How It
              </TextReveal>{' '}
              <TextReveal 
                text="Works" 
                className="text-gradient"
                delay={0.2}
              />
            </h2>
            <p className="text-center text-white/70 max-w-md mx-auto">
              Transform your fashion experience in four simple steps
            </p>
          </motion.div>
        </div>

        <div 
          ref={panelsRef} 
          className="absolute top-[120px] left-0 w-[400vw] h-screen flex flex-row overflow-hidden max-w-[400vw]"
        >
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`panel w-screen h-screen flex items-center justify-center flex-col md:flex-row px-4 sm:px-10 md:px-16 box-border ${index === 0 ? 'active' : ''} overflow-hidden`}
            >
              <div className="step-content transform translate-y-[50px] opacity-0 w-full md:w-1/2 p-6 md:p-10">
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl">{step.icon}</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-acorn font-bold mt-4">
                    {step.id}. {step.title}
                  </h3>
                  <div className={`h-1 w-20 bg-gradient-to-r ${step.color} mt-4 mb-6 rounded-full`}></div>
                  <p className="text-white/80 text-lg">{step.description}</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block mt-4"
                >
                  <a 
                    href={`#step-${step.id}`} 
                    className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 border border-white/30"
                  >
                    <span className="relative flex items-center">
                      Learn more
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                </motion.div>
              </div>
              
              <div className="step-image transform scale-90 opacity-70 w-full md:w-1/2 max-w-[550px] h-[300px] md:h-[450px] relative rounded-2xl overflow-hidden shadow-2xl mt-8 md:mt-0 box-border mx-auto md:mx-0">
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-tr ${step.color} opacity-30 z-10`}
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="z-0 transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {steps.map((step, index) => (
            <motion.button 
              key={index}
              className={`w-3 h-3 rounded-full bg-white/30 transition-all ${index === 0 ? 'bg-white w-6' : ''}`}
              aria-label={`Go to step ${step.id}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 