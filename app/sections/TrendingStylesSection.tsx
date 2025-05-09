'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TrendingStylesSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const trendingStyles = [
    {
      id: 1,
      name: 'Modern Minimalist',
      description: 'Clean lines, neutral colors, understated elegance',
      color: 'bg-zinc-200'
    },
    {
      id: 2,
      name: 'Retro Revival',
      description: '70s inspired prints, high waists, and vintage accessories',
      color: 'bg-amber-200'
    },
    {
      id: 3,
      name: 'Eco Chic',
      description: 'Sustainable materials with contemporary styling',
      color: 'bg-emerald-200'
    },
    {
      id: 4,
      name: 'Urban Utility',
      description: 'Functional details, cargo elements, and bold proportions',
      color: 'bg-slate-300'
    },
    {
      id: 5,
      name: 'Futuristic Fusion',
      description: 'Metallic accents, innovative textures, and cutting-edge silhouettes',
      color: 'bg-purple-200'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });

      // Update active index for indicators
      const newIndex = direction === 'left' 
        ? Math.max(0, activeIndex - 1) 
        : Math.min(trendingStyles.length - 1, activeIndex + 1);
      setActiveIndex(newIndex);
    }
  };

  return (
    <section id="trending-styles" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-acorn font-bold mb-4 text-primary dark:text-white">
            Top <span className="text-gradient">Trending Styles</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the hottest fashion trends curated by our AI. Find your perfect style and try it on virtually.
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all"
            disabled={activeIndex === 0}
            aria-label="Previous item"
          >
            <svg className="w-6 h-6 text-primary dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all"
            disabled={activeIndex === trendingStyles.length - 1}
            aria-label="Next item"
          >
            <svg className="w-6 h-6 text-primary dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Carousel */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-6 pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingStyles.map((style) => (
              <motion.div 
                key={style.id}
                className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px] flex-shrink-0 snap-center"
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full flex flex-col">
                  <div className={`relative h-[300px] overflow-hidden ${style.color}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent mix-blend-overlay z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">{style.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{style.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{style.description}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <span>Try Now</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {trendingStyles.map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? 'w-6 bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                onClick={() => {
                  setActiveIndex(index);
                  if (carouselRef.current) {
                    const scrollAmount = index * (carouselRef.current.clientWidth * 0.8);
                    carouselRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingStylesSection; 