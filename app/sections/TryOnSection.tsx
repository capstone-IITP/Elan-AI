'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

// Mock clothing items for the demo
const clothingItems = [
  {
    id: 1,
    name: 'White Button-Up Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    category: 'tops',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150'
  },
  {
    id: 2,
    name: 'Black Slim Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
    category: 'bottoms',
    thumbnail: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=150'
  },
  {
    id: 3,
    name: 'Navy Blazer',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f',
    category: 'tops',
    thumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=150'
  },
  {
    id: 4,
    name: 'Beige Trousers',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    category: 'bottoms',
    thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=150'
  },
  {
    id: 5,
    name: 'White Sneakers',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    category: 'shoes',
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150'
  },
  {
    id: 6,
    name: 'Leather Watch',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
    category: 'accessories',
    thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=150'
  },
  {
    id: 7,
    name: 'Blue Denim Shirt',
    image: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e',
    category: 'tops',
    thumbnail: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=150'
  },
  {
    id: 8,
    name: 'Grey Hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    category: 'tops',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150'
  }
];

// Avatar placeholder images for different views and genders
const avatarImages = {
  female: {
    front: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600',
    side: 'https://images.unsplash.com/photo-1622495966027-e0d14fee614c?auto=format&fit=crop&w=600',
    back: 'https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?auto=format&fit=crop&w=600'
  },
  male: {
    front: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?auto=format&fit=crop&w=600',
    side: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?auto=format&fit=crop&w=600',
    back: 'https://images.unsplash.com/photo-1619785292559-a15caa5a11fc?auto=format&fit=crop&w=600'
  }
};

const TryOnSection = () => {
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number | null}>({
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null
  });
  
  const [currentView, setCurrentView] = useState<'front' | 'side' | 'back'>('front');
  const [currentGender, setCurrentGender] = useState<'female' | 'male'>('female');
  const [dragging, setDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const dragItemsRef = useRef<HTMLDivElement>(null);
  const draggableInstancesRef = useRef<any[]>([]);
  
  // Register GSAP plugins effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, Draggable);
    }
  }, []);
  
  // Set up draggable items whenever they change
  useEffect(() => {
    if (!dragItemsRef.current) return;
    
    // Clean up previous draggable instances
    draggableInstancesRef.current.forEach(instance => {
      if (instance && instance.kill) {
        instance.kill();
      }
    });
    draggableInstancesRef.current = [];
    
    // Make new items draggable
    const items = dragItemsRef.current.querySelectorAll('.drag-item');
    
    items.forEach(item => {
      const draggableInstance = Draggable.create(item, {
        type: 'x,y',
        bounds: document.body,
        onDragStart: function() {
          setDragging(true);
          gsap.to(this.target, { 
            scale: 1.1, 
            zIndex: 100, 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
            duration: 0.2 
          });
        },
        onDrag: function() {
          // While dragging, check if over the model area
          const modelRect = modelRef.current?.getBoundingClientRect();
          const itemRect = this.target.getBoundingClientRect();
          
          if (modelRect && isOverlapping(modelRect, itemRect)) {
            gsap.to(this.target, { 
              opacity: 0.8, 
              duration: 0.2 
            });
            // Visual feedback that item can be dropped
            if (modelRef.current) {
              modelRef.current.classList.add('highlight-drop-zone');
            }
          } else {
            gsap.to(this.target, { 
              opacity: 1, 
              duration: 0.2 
            });
            if (modelRef.current) {
              modelRef.current.classList.remove('highlight-drop-zone');
            }
          }
        },
        onDragEnd: function() {
          setDragging(false);
          gsap.to(this.target, { 
            scale: 1, 
            zIndex: 1, 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            duration: 0.2 
          });
          
          // Check if item is dropped on avatar
          const modelRect = modelRef.current?.getBoundingClientRect();
          const itemRect = this.target.getBoundingClientRect();
          
          if (modelRef.current) {
            modelRef.current.classList.remove('highlight-drop-zone');
          }
          
          if (modelRect && isOverlapping(modelRect, itemRect)) {
            // Identify the item and add to selected items
            const itemId = parseInt(this.target.getAttribute('data-id') || '0');
            const category = this.target.getAttribute('data-category') || '';
            
            if (itemId && category) {
              setSelectedItems(prev => ({
                ...prev,
                [category]: itemId
              }));
              
              // Animate the item "applying" to the model
              gsap.to(this.target, { 
                x: 0, 
                y: 0, 
                opacity: 0, 
                scale: 0.5,
                duration: 0.5,
                onComplete: () => {
                  gsap.set(this.target, { opacity: 1, scale: 1 });
                }
              });
              
              // Give visual feedback that item was applied
              if (modelRef.current) {
                gsap.to(modelRef.current, {
                  boxShadow: '0 0 30px rgba(255,255,255,0.5)',
                  duration: 0.3,
                  repeat: 1,
                  yoyo: true
                });
              }
            }
          } else {
            // Return to original position
            gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
          }
        }
      });
      
      draggableInstancesRef.current.push(draggableInstance[0]);
    });
    
    return () => {
      // Clean up on unmount
      draggableInstancesRef.current.forEach(instance => {
        if (instance && instance.kill) {
          instance.kill();
        }
      });
    };
  }, [activeCategory]);
  
  // Helper to check if rectangles overlap
  const isOverlapping = (rect1: DOMRect, rect2: DOMRect) => {
    return !(
      rect1.right < rect2.left || 
      rect1.left > rect2.right || 
      rect1.bottom < rect2.top || 
      rect1.top > rect2.bottom
    );
  };
  
  // Reset selected items
  const resetOutfit = () => {
    setSelectedItems({
      tops: null,
      bottoms: null,
      shoes: null,
      accessories: null
    });
    
    // Animation for reset
    gsap.fromTo(modelRef.current, 
      { opacity: 1 }, 
      { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => {
          gsap.to(modelRef.current, { opacity: 1, duration: 0.5 });
        }
      }
    );
  };
  
  // Toggle between views (front, side, back)
  const changeView = (view: 'front' | 'side' | 'back') => {
    if (view === currentView) return;
    
    // Animation for view change
    gsap.to(modelRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      onComplete: () => {
        setCurrentView(view);
        gsap.to(modelRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5
        });
      }
    });
  };
  
  // Toggle gender
  const toggleGender = () => {
    // Animation for gender change
    gsap.to(modelRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      onComplete: () => {
        setCurrentGender(currentGender === 'female' ? 'male' : 'female');
        gsap.to(modelRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1
        });
      }
    });
  };
  
  // Filter items by category
  const filteredItems = activeCategory 
    ? clothingItems.filter(item => item.category === activeCategory) 
    : clothingItems;
  
  return (
    <section 
      ref={sectionRef}
      id="try-on"
      className="min-h-screen bg-gradient-to-b from-primary/95 to-primary/90 text-white py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="tryon-title text-4xl md:text-5xl font-acorn font-bold mb-6">
            Virtual <span className="text-gradient">Try-On</span> Experience
          </h2>
          
          <p className="text-white/70 max-w-2xl mx-auto">
            See how outfits look on your body with our AI-powered virtual try-on technology. 
            Drag and drop clothes onto the model to visualize your perfect look.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left sidebar - Items to drag */}
          <div 
            ref={itemsContainerRef}
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-medium mb-4">Wardrobe Items</h3>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === null 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveCategory('tops')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'tops' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                Tops
              </button>
              <button
                onClick={() => setActiveCategory('bottoms')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'bottoms' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                Bottoms
              </button>
              <button
                onClick={() => setActiveCategory('shoes')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'shoes' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                Shoes
              </button>
              <button
                onClick={() => setActiveCategory('accessories')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'accessories' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                Accessories
              </button>
            </div>
            
            {/* Draggable items */}
            <div 
              ref={dragItemsRef}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="drag-item relative bg-black/30 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow group border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  data-id={item.id}
                  data-category={item.category}
                  title={`Drag ${item.name} to the model`}
                >
                  <div className="overflow-hidden h-32">
                    <Image 
                      src={item.thumbnail || item.image}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 text-sm opacity-80 group-hover:opacity-100 text-white/90 truncate">
                    {item.name}
                  </div>
                  <div className="absolute top-1 right-1 bg-black/60 rounded px-1.5 py-0.5 text-xs capitalize">
                    {item.category}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-white/50 italic">
              Drag items to the model to try them on
            </div>
          </div>
          
          {/* Center section - Model preview */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Model Preview</h3>
                
                <div className="flex space-x-2">
                  {/* View toggle buttons */}
                  <div className="flex bg-black/30 rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => changeView('front')}
                      className={`px-3 py-1 rounded-md text-sm transition-all ${
                        currentView === 'front' 
                          ? 'bg-accent text-white' 
                          : 'hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      onClick={() => changeView('side')}
                      className={`px-3 py-1 rounded-md text-sm transition-all ${
                        currentView === 'side' 
                          ? 'bg-accent text-white' 
                          : 'hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      Side
                    </button>
                    <button
                      onClick={() => changeView('back')}
                      className={`px-3 py-1 rounded-md text-sm transition-all ${
                        currentView === 'back' 
                          ? 'bg-accent text-white' 
                          : 'hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                  
                  {/* Gender toggle button */}
                  <button
                    onClick={toggleGender}
                    className="bg-black/30 hover:bg-black/40 px-3 py-1 rounded-lg text-sm border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <span>Switch to {currentGender === 'female' ? 'Male' : 'Female'}</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={currentGender === 'female' 
                        ? "M16 3h5v5M14 10l7-7M8 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"  // Female
                        : "M10 14l-2 2m2-2v6m0-6h6m6-10v5h-5m0 0l7-7M8 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"  // Male
                      } />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Model display area with placeholder image */}
              <div 
                ref={modelRef}
                className={`relative flex justify-center rounded-xl overflow-hidden transition-all bg-black/30 min-h-[500px] ${dragging ? 'highlight-droppable' : ''}`}
              >
                <div className="relative w-full max-w-md">
                  <Image
                    src={avatarImages[currentGender][currentView]}
                    alt={`${currentGender} model ${currentView} view`}
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                  
                  {/* Overlay for selected items visualization (simplified) */}
                  {Object.entries(selectedItems).map(([category, itemId]) => {
                    if (!itemId) return null;
                    const item = clothingItems.find(i => i.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div 
                        key={`${category}-${itemId}`}
                        className="absolute inset-0 flex justify-center items-center"
                      >
                        <div className="absolute text-sm bg-black/70 rounded px-2 py-0.5 bottom-2 left-2">
                          {item.name}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Instructions overlay */}
                  {!Object.values(selectedItems).some(Boolean) && (
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white/90 max-w-xs text-center">
                        Drag and drop clothing items here to try them on
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Selected outfit summary */}
            <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Current Outfit</h3>
                <button
                  onClick={resetOutfit}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3z" />
                    <path d="M9 9l6 6m0-6l-6 6" />
                  </svg>
                  <span>Reset Outfit</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['tops', 'bottoms', 'shoes', 'accessories'].map(category => {
                  const itemId = selectedItems[category];
                  const item = itemId ? clothingItems.find(i => i.id === itemId) : null;
                  
                  return (
                    <div key={category} className="bg-black/30 rounded-lg p-3 border border-white/10">
                      <div className="text-sm text-white/70 mb-1 capitalize">{category}</div>
                      {item ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-black/50 rounded overflow-hidden">
                            <Image 
                              src={item.thumbnail || item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-sm truncate">{item.name}</div>
                        </div>
                      ) : (
                        <div className="text-sm italic text-white/50">None selected</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .highlight-drop-zone {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2);
        }
        
        .highlight-droppable {
          background: rgba(0, 0, 0, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </section>
  );
};

export default TryOnSection; 