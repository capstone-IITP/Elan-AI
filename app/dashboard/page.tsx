'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Define clothing item type
interface ClothingItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Shoes' | 'Accessories';
  imageSrc: string;
}

// Dummy data for clothing items
const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'White Button-Up Shirt',
    category: 'Tops',
    imageSrc: '/images/clothing/white-shirt.jpg',
  },
  {
    id: '2',
    name: 'Black Slim Pants',
    category: 'Bottoms',
    imageSrc: '/images/clothing/black-pants.jpg',
  },
  {
    id: '3', 
    name: 'Navy Blazer',
    category: 'Tops',
    imageSrc: '/images/clothing/navy-blazer.jpg',
  },
  {
    id: '4',
    name: 'Beige Trousers',
    category: 'Bottoms',
    imageSrc: '/images/clothing/beige-trousers.jpg',
  },
  {
    id: '5',
    name: 'Brown Loafers',
    category: 'Shoes',
    imageSrc: '/images/clothing/brown-shoes.jpg',
  },
  {
    id: '6',
    name: 'Wristwatch',
    category: 'Accessories',
    imageSrc: '/images/clothing/wristwatch.jpg',
  },
];

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [currentOutfit, setCurrentOutfit] = useState<{
    Tops: ClothingItem | null;
    Bottoms: ClothingItem | null;
    Shoes: ClothingItem | null;
    Accessories: ClothingItem | null;
  }>({
    Tops: null,
    Bottoms: null,
    Shoes: null,
    Accessories: null,
  });
  const [activeView, setActiveView] = useState<'Front' | 'Side' | 'Back'>('Front');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData('item')) as ClothingItem;
      setCurrentOutfit(prev => ({
        ...prev,
        [item.category]: item
      }));
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetOutfit = () => {
    setCurrentOutfit({
      Tops: null,
      Bottoms: null,
      Shoes: null,
      Accessories: null
    });
  };

  const filteredItems = selectedCategory === 'All Items' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/95 text-white">
      <header className="bg-black/50 backdrop-blur-md shadow-md border-b border-gray-800/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-acorn">
            <span className="text-gradient">Élan</span> AI
          </h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="hover:bg-white/5"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m1 1l-7 7m7-7l2-2" />
                </svg>
              }
            >
              Home
            </Button>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-acorn font-bold mb-2">
            Virtual <span className="text-gradient">Try-On</span> Experience
          </h1>
          <p className="text-gray-400 mb-2 max-w-2xl mx-auto">
            See how outfits look on your body with our AI-powered virtual try-on technology.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-accent via-accent-hover to-accent mx-auto mt-4 mb-6 rounded-full"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Wardrobe sidebar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full lg:w-1/3 glassmorphism p-6 rounded-xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-4 font-display">Your Wardrobe</h2>
            
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 items-center">
              {['All Items', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-glow' 
                      : 'bg-gray-800/60 hover:bg-gray-700/60 text-white/80'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariant}
                  className="bg-gray-800/60 rounded-lg p-3 relative card-hover"
                >
                  <div 
                    className="h-full w-full absolute inset-0 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                  ></div>
                  <div className="relative h-36 w-full overflow-hidden rounded-md mb-2">
                    <div className="absolute top-0 right-0 m-1 z-10 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-medium">
                      {item.category}
                    </div>
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/150x150/333/FFF?text=No+Image";
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </motion.div>
              ))}
            </motion.div>
            <p className="text-xs text-gray-400 italic mt-4 text-center">Drag items to the model to try them on</p>
          </motion.div>

          {/* Model preview section */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="glassmorphism p-6 rounded-xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-display">Model Preview</h2>
                <div className="flex space-x-2">
                  {['Front', 'Side', 'Back'].map((view) => (
                    <motion.button 
                      key={view}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeView === view 
                          ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-glow' 
                          : 'bg-gray-800/60 hover:bg-gray-700/60 text-white/80'
                      }`}
                      onClick={() => setActiveView(view as 'Front' | 'Side' | 'Back')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {view}
                    </motion.button>
                  ))}
                  <motion.button 
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800/60 hover:bg-gray-700/80 flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Switch Model</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-gray-800/40 to-black/80 relative h-[500px] rounded-lg flex justify-center items-center overflow-hidden border border-white/5"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex justify-center items-center"
                  >
                    <div className="relative h-full max-h-full overflow-hidden">
                      <Image
                        src={`/images/model/${activeView.toLowerCase() === 'front' ? 'female_model_front.jpg' : 
                             activeView.toLowerCase() === 'side' ? 'female_model_side.jpg' : 
                             'female_model_back.jpg'}`}
                        alt={`Model ${activeView} View`}
                        width={400}
                        height={600}
                        className="h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://placehold.co/400x600/333/FFF?text=Model+${activeView}`;
                        }}
                      />
                      {/* Clothing layers would be rendered here */}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {!currentOutfit.Tops && !currentOutfit.Bottoms && !currentOutfit.Shoes && !currentOutfit.Accessories && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute flex justify-center items-center glassmorphism rounded-xl px-6 py-4 max-w-md text-center"
                  >
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg font-medium mb-1">Create Your Perfect Look</p>
                      <p className="text-gray-300 text-sm">Drag and drop clothing items here to try them on</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Current outfit section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="glassmorphism p-6 rounded-xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Current Outfit</h2>
                <motion.button 
                  onClick={resetOutfit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-900/30 hover:bg-red-800/40 border border-red-700/30 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Reset Outfit</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Tops', 'Bottoms', 'Shoes', 'Accessories'].map((category) => (
                  <motion.div 
                    key={category}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg border border-white/5"
                  >
                    <h3 className="text-sm font-bold mb-3 text-gray-300">{category}</h3>
                    {currentOutfit[category as keyof typeof currentOutfit] ? (
                      <div className="space-y-2">
                        <div className="relative h-28 w-full overflow-hidden rounded-md">
                          <Image
                            src={currentOutfit[category as keyof typeof currentOutfit]!.imageSrc}
                            alt={currentOutfit[category as keyof typeof currentOutfit]!.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://placehold.co/120x120/333/FFF?text=${category}`;
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentOutfit(prev => ({
                              ...prev,
                              [category]: null
                            }))}
                            className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-600/80 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        </div>
                        <p className="text-sm truncate">{currentOutfit[category as keyof typeof currentOutfit]!.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-28 bg-gray-900/40 rounded-md border border-dashed border-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs text-gray-500">Add {category}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button 
                  variant="gradient"
                  className="shadow-glow"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                >
                  Save Current Outfit
                </Button>
              </div>
            </motion.div>

            {/* Style recommendations */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="glassmorphism p-6 rounded-xl border border-white/10"
            >
              <h2 className="text-2xl font-bold font-display mb-4">AI Style Recommendations</h2>
              <p className="text-gray-400 mb-4">Based on your preferences and current outfit selections</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-accent/20 to-transparent p-4 rounded-lg border border-accent/20">
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent/30 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Contemporary Casual</h3>
                      <p className="text-xs text-gray-300 mt-1">Perfect for everyday outings with a modern touch</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-500/30 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Business Professional</h3>
                      <p className="text-xs text-gray-300 mt-1">Elegant and sophisticated for workplace settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Add global styles for the dashboard */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 61, 0, 0.3);
        }
        .glassmorphism {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};

export default DashboardPage; 