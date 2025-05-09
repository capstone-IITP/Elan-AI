'use client';

import { useState } from 'react';
import TryOnDropzone from '../components/TryOnDropzone';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define the clothing item interface
interface ClothingItem {
  id: string;
  type: string;
  name: string;
  imageSrc?: string;
  file?: File;
}

// Sample clothing items for the example
const clothingItems: ClothingItem[] = [
  {
    id: '1',
    type: 'tops',
    name: 'White Button-Up Shirt',
    imageSrc: '/images/clothing/white-shirt.jpg',
  },
  {
    id: '2',
    type: 'bottoms',
    name: 'Black Slim Pants',
    imageSrc: '/images/clothing/black-pants.jpg',
  },
  {
    id: '3', 
    type: 'tops',
    name: 'Navy Blazer',
    imageSrc: '/images/clothing/navy-blazer.jpg',
  },
  {
    id: '4',
    type: 'accessories',
    name: 'Silver Watch',
    imageSrc: '/images/clothing/wristwatch.jpg',
  },
];

export default function TryOnExamplePage() {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState<{[key: string]: string}>({});
  
  // Handle drag start for clothing items
  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };
  
  // Handle item dropped onto the dropzone
  const handleItemDrop = (item: ClothingItem) => {
    console.log('Try-on item:', item);
    
    // If item has a file (uploaded image), process it
    if (item.file) {
      // Create object URL for the file
      const objectUrl = URL.createObjectURL(item.file);
      
      // Store the URL in state with the item id as key
      setUploadedImagesUrls(prev => ({
        ...prev,
        [item.id]: objectUrl
      }));
      
      // Store the file
      setUploadedFiles(prev => [...prev, item.file as File]);
    }
    
    // Add the item to selected items list if not already included
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(prev => [...prev, item]);
    }
  };
  
  // Handle image upload from the dropzone
  const handleImageUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    setUploadedFiles(prev => [...prev, ...files]);
  };
  
  // Remove an item from the selection
  const removeItem = (itemId: string) => {
    // If it's an uploaded file, revoke its object URL
    if (uploadedImagesUrls[itemId]) {
      URL.revokeObjectURL(uploadedImagesUrls[itemId]);
      
      // Remove from URLs state
      const newUrls = {...uploadedImagesUrls};
      delete newUrls[itemId];
      setUploadedImagesUrls(newUrls);
    }
    
    // Remove from selected items
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Get display image source for an item (either from imageSrc prop or from uploaded file)
  const getItemImageSrc = (item: ClothingItem) => {
    if (uploadedImagesUrls[item.id]) {
      return uploadedImagesUrls[item.id];
    }
    return item.imageSrc || "https://placehold.co/150x150/333/FFF?text=No+Image";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Virtual <span className="text-[#FF5C00]">Try-On</span> Demo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Drag clothing items or upload your own images to try them on virtually.
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Wardrobe items */}
          <div className="w-full lg:w-1/3 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-4">Your Wardrobe</h2>
            <p className="text-sm text-gray-400 mb-4">Drag items to the try-on area</p>
            
            <div className="grid grid-cols-2 gap-4">
              {clothingItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gray-800/80 rounded-lg p-3 relative cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs">
                    {item.type}
                  </div>
                  <div className="relative h-32 w-full overflow-hidden rounded-md mb-2">
                    <Image
                      src={item.imageSrc || "https://placehold.co/150x150/333/FFF?text=No+Image"}
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
            </div>
          </div>
          
          {/* Try-on area */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <TryOnDropzone 
              onItemDrop={handleItemDrop}
              onImageUpload={handleImageUpload}
              currentItems={selectedItems}
              className="h-[400px]"
            />
            
            {/* Selected items */}
            {selectedItems.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4">Selected Items</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-700/70 rounded-lg overflow-hidden flex flex-col"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        {item.file || uploadedImagesUrls[item.id] ? (
                          // For uploaded images, use object URL
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getItemImageSrc(item)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          // For regular items with imageSrc
                          <Image
                            src={item.imageSrc || "https://placehold.co/150x150/333/FFF?text=No+Image"}
                            alt={item.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/150x150/333/FFF?text=No+Image";
                            }}
                          />
                        )}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-600/80 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">How to Use</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/40 p-4 rounded-lg">
                  <h3 className="font-bold text-[#FF5C00] mb-2 flex items-center">
                    <span className="bg-[#FF5C00]/20 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">1</span>
                    Add items to try-on
                  </h3>
                  <ul className="list-disc pl-8 text-sm space-y-1 text-gray-300">
                    <li>Drag clothing items from your wardrobe</li>
                    <li>Upload your own images with the upload buttons</li>
                    <li>Your mobile camera can be used for instant try-on</li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/40 p-4 rounded-lg">
                  <h3 className="font-bold text-[#FF5C00] mb-2 flex items-center">
                    <span className="bg-[#FF5C00]/20 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">2</span>
                    View and manage items
                  </h3>
                  <ul className="list-disc pl-8 text-sm space-y-1 text-gray-300">
                    <li>All selected items appear in the gallery below</li>
                    <li>Remove unwanted items by clicking the (×) button</li>
                    <li>Upload more images at any time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 