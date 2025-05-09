'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string | string[];
  className?: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  onComplete?: () => void;
}

const Typewriter = ({
  text,
  className = '',
  speed = 70,
  delay = 1500,
  loop = false,
  cursor = true,
  onComplete,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const currentTextRef = useRef<string>('');
  
  // Handle array of texts or single text
  const textArray = Array.isArray(text) ? text : [text];
  
  useEffect(() => {
    const textToType = textArray[textArrayIndex];
    currentTextRef.current = textToType;
    
    // Handle the typing effect
    const handleTyping = () => {
      if (isDeleting) {
        // Deleting text
        setDisplayText(textToType.substring(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);
        
        if (currentIndex <= 1) {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setTextArrayIndex((textArrayIndex + 1) % textArray.length);
          
          if (textArrayIndex === textArray.length - 1 && !loop) {
            // Completed the cycle and not looping
            onComplete?.();
            return;
          }
        }
      } else {
        // Typing text
        setDisplayText(textToType.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
        
        if (currentIndex >= textToType.length - 1) {
          // Finished typing
          if (textArray.length === 1 && !loop) {
            // Single text, no loop, we're done
            onComplete?.();
            return;
          }
          
          // Wait before deleting or moving to next text
          setTimeout(() => {
            if (textArray.length > 1 || loop) {
              setIsDeleting(true);
            }
          }, delay);
          
          return;
        }
      }
    };
    
    // Calculate typing speed - faster for deleting
    const typingSpeed = isDeleting ? speed / 2 : speed;
    
    // Set up interval
    const interval = setTimeout(handleTyping, typingSpeed);
    
    return () => clearTimeout(interval);
  }, [currentIndex, delay, isDeleting, loop, onComplete, speed, text, textArray, textArrayIndex]);
  
  return (
    <span className={className}>
      {displayText}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default Typewriter; 