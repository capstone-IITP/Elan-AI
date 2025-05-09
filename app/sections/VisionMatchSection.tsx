'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Sample generated outfits based on descriptions
const outfitPresets = [
  {
    id: 1,
    prompt: "A professional outfit for a summer office day",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc",
    colors: ["#f8f9fa", "#e9ecef", "#dee2e6", "#6c757d"]
  },
  {
    id: 2,
    prompt: "Casual weekend brunch outfit with friends",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    colors: ["#ffcdb2", "#ffb4a2", "#e5989b", "#b5838d"]
  },
  {
    id: 3,
    prompt: "Elegant evening gala outfit with accessories",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    colors: ["#0d1b2a", "#1b263b", "#415a77", "#778da9"]
  }
];

const VisionMatchSection = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<typeof outfitPresets[0] | null>(null);
  const [particles, setParticles] = useState<Array<{ x: number, y: number, color: string, size: number, speed: number }>>([]);
  
  const sectionRef = useRef<HTMLElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Generate particles for background effect
  useEffect(() => {
    const colors = generatedOutfit?.colors || ["#ff3d00", "#ff9e80", "#ff7043", "#ffab91"];
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 3,
      speed: Math.random() * 0.2 + 0.1
    }));
    
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y - particle.speed < 0 ? 100 : particle.y - particle.speed
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [generatedOutfit]);
  
  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Animate section title on scroll
    gsap.from('.vision-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      }
    });
    
    // Animate the input field on scroll
    gsap.from('.vision-input', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      }
    });
    
    // Clean up animation
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  // Handle text-to-image generation
  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    // Animate generation process
    const tl = gsap.timeline({
      onComplete: () => {
        // After animation, show a preset outfit that's closest to the prompt
        // In a real app, this would be an actual AI generation
        const outfit = outfitPresets.find(o => 
          prompt.toLowerCase().includes(o.prompt.toLowerCase().split(' ').slice(1, 3).join(' '))
        ) || outfitPresets[Math.floor(Math.random() * outfitPresets.length)];
        
        setGeneratedOutfit(outfit);
        setIsGenerating(false);
        
        // Animate the result appearing
        gsap.fromTo(resultRef.current, 
          { opacity: 0, scale: 0.8 }, 
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
        );
      }
    });
    
    // Animate the input text shrinking/fading
    tl.to(textInputRef.current, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.3
    })
    // Animate particles becoming more active
    .to(particlesRef.current, {
      opacity: 0.8,
      duration: 0.5
    }, "-=0.2")
    // Wait for "AI generation"
    .to({}, { duration: 1.5 }); 
  };
  
  return (
    <section 
      ref={sectionRef}
      id="vision-match"
      className="min-h-screen bg-gradient-to-b from-primary to-primary/95 text-white py-20 relative overflow-hidden"
    >
      {/* Animated background particles */}
      <div 
        ref={particlesRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-500"
      >
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: 0.6,
              transition: 'top 0.5s linear'
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="vision-title text-4xl md:text-5xl font-acorn font-bold text-center mb-6">
            Vision <span className="text-gradient">Match</span>: AI + Imagination
          </h2>
          
          <div className="flex justify-center items-center mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-medium text-center max-w-3xl">
              Describe your perfect outfit in natural language, and watch as our AI turns your words into visual fashion inspiration.
            </p>
          </div>
          
          <div className="vision-input bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={textInputRef}
                  type="text"
                  placeholder="Describe your perfect outfit (e.g., 'Professional summer office look')"
                  className="w-full bg-white/10 border-0 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:ring-accent focus:ring-2 outline-none transition-all"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-3 rounded-lg font-medium text-white ${
                  isGenerating || !prompt.trim() 
                    ? 'bg-accent/50 cursor-not-allowed' 
                    : 'bg-accent hover:bg-accent/90'
                } transition-colors duration-300 min-w-[120px]`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span className="ml-2">Dreaming...</span>
                  </div>
                ) : 'Generate'}
              </motion.button>
            </div>
            
            {/* Example prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              <p className="text-sm text-white/60">Try:</p>
              {outfitPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setPrompt(preset.prompt)}
                  className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                >
                  {preset.prompt}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results area */}
          {generatedOutfit && (
            <div 
              ref={resultRef}
              className="mt-12 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 overflow-hidden shadow-lg box-border w-full"
            >
              <h3 className="text-xl font-bold mb-4">AI Generated Outfit</h3>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 w-full">
                <div className="w-full md:w-1/2 min-w-0 flex-shrink-1 box-border">
                  <div className="relative w-full h-[300px] sm:h-[350px] md:h-[320px] rounded-lg overflow-hidden">
                    <Image
                      src={generatedOutfit.image}
                      alt="Generated outfit"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className="transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-between min-w-0 flex-shrink-1 box-border">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Based on your prompt:</h4>
                    <p className="text-white/80 italic mb-6">"{generatedOutfit.prompt}"</p>
                    
                    <h4 className="text-lg font-medium mb-2">Color Palette:</h4>
                    <div className="flex gap-2 mb-6">
                      {generatedOutfit.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <p className="text-white/70">
                      This outfit was generated based on your prompt. In the full app, our advanced AI would create a completely custom outfit visualization that matches your exact description, body type, and style preferences.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Try On
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Refine
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VisionMatchSection; 