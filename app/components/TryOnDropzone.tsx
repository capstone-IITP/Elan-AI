'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the clothing item interface
interface ClothingItem {
  id: string;
  type: string;
  name: string;
  imageSrc?: string;
  file?: File;
  [key: string]: any; // Allow for additional properties
}

interface TryOnDropzoneProps {
  onItemDrop: (item: ClothingItem) => void;
  onImageUpload?: (files: File[]) => void;
  className?: string;
  currentItems?: ClothingItem[];
}

const TryOnDropzone = ({ 
  onItemDrop, 
  onImageUpload,
  className = '', 
  currentItems = [] 
}: TryOnDropzoneProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastDroppedItem, setLastDroppedItem] = useState<ClothingItem | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      // Check if files were dropped
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFilesDrop(e.dataTransfer.files);
        return;
      }
      
      // Otherwise, try to parse dropped clothing item
      const itemData = e.dataTransfer.getData('item');
      if (!itemData) return;
      
      const item = JSON.parse(itemData) as ClothingItem;
      
      // Set the last dropped item for confirmation message
      setLastDroppedItem(item);
      setShowConfirmation(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Hide the confirmation message after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
      
      // Call the callback function
      onItemDrop(item);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleFilesDrop = (fileList: FileList) => {
    // Process dropped files
    const files = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) return;
    
    // Add files to state
    setUploadedImages(prev => [...prev, ...files]);
    
    // Create clothing items from files and pass to parent component
    files.forEach((file, index) => {
      const newItem: ClothingItem = {
        id: `upload-${Date.now()}-${index}`,
        type: 'uploaded',
        name: file.name.split('.')[0],
        file: file
      };
      
      // Set confirmation and call callback
      setLastDroppedItem(newItem);
      setShowConfirmation(true);
      onItemDrop(newItem);
    });
    
    // Call image upload callback if provided
    if (onImageUpload) {
      onImageUpload(files);
    }
    
    // Hide confirmation after delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesDrop(e.target.files);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const containerVariants = {
    idle: { 
      boxShadow: '0 0 0 rgba(255, 92, 0, 0)' 
    },
    hover: { 
      boxShadow: '0 0 20px rgba(255, 92, 0, 0.5)' 
    }
  };

  const confirmationVariants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95 
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: 'rgba(255, 92, 0, 0.3)'
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div 
      className={`relative w-full max-w-lg mx-auto rounded-xl overflow-hidden ${className}`}
      initial="idle"
      animate={isDraggingOver ? 'hover' : 'idle'}
      variants={containerVariants}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`
          h-full min-h-[250px] flex flex-col items-center justify-center
          p-8 text-center transition-all duration-300
          bg-gradient-to-br from-gray-800/60 to-black/80 backdrop-blur-md
          border-2 ${isDraggingOver ? 'border-[#FF5C00]' : 'border-white/10'}
          rounded-xl
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleFileInputChange}
        />
        
        {/* Confirmation message overlay */}
        <AnimatePresence>
          {showConfirmation && lastDroppedItem && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-xl"
              variants={confirmationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center">
                <div className="mb-2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF5C00]/20 text-[#FF5C00]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Item Added!</h3>
                <p className="text-gray-200">{lastDroppedItem.name} added to your try-on</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state or with items */}
        {currentItems.length === 0 ? (
          <div className="relative z-0">
            <motion.div
              className="w-20 h-20 mb-4 bg-[#FF5C00]/20 rounded-full flex items-center justify-center text-[#FF5C00] mx-auto"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </motion.div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Create Your Perfect Look</h2>
            <p className="text-gray-300 max-w-xs mx-auto mb-5">
              Drag and drop clothing items here to try them on
            </p>
            
            {/* Upload buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
              <motion.button
                onClick={triggerFileInput}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-4 py-2 bg-[#FF5C00]/20 border border-[#FF5C00]/30 rounded-lg text-[#FF5C00] flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </motion.button>
              <motion.button
                onClick={triggerFileInput}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-4 py-2 bg-gray-800/60 border border-white/10 rounded-lg text-white/80 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="relative z-0 text-center">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {currentItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-[#FF5C00]/20 text-[#FF5C00] rounded-full text-sm border border-[#FF5C00]/30"
                >
                  {item.name}
                </motion.div>
              ))}
            </div>
            <p className="text-white text-sm mb-4">
              Drop more items to complete your look
            </p>
            
            {/* Upload button when items exist */}
            <motion.button
              onClick={triggerFileInput}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-3 py-1.5 bg-[#FF5C00]/20 border border-[#FF5C00]/30 rounded-lg text-[#FF5C00] text-sm flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Image
            </motion.button>
          </div>
        )}

        {/* Visual feedback for drag-over state */}
        <AnimatePresence>
          {isDraggingOver && (
            <motion.div
              className="absolute inset-0 border-2 border-dashed border-[#FF5C00] rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TryOnDropzone; 