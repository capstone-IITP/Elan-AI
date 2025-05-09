'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../lib/animations';

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
}

const FormInput = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon,
  className = '',
  disabled = false,
  autoComplete,
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Basic error animation
  const errorVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      height: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    }
  };

  // Border animation
  const borderVariants = {
    idle: { 
      borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(229, 231, 235)',
      boxShadow: '0 0 0 0px rgba(255, 61, 0, 0)'
    },
    focus: { 
      borderColor: error ? 'rgb(239, 68, 68)' : 'rgb(255, 61, 0)',
      boxShadow: error 
        ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
        : '0 0 0 3px rgba(255, 61, 0, 0.2)'
    }
  };

  // Icon animation
  const iconVariants = {
    idle: { 
      scale: 1,
      color: error ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)' 
    },
    focus: { 
      scale: 1.1,
      color: error ? 'rgb(239, 68, 68)' : 'rgb(255, 61, 0)' 
    }
  };

  // Label animation
  const labelVariants = {
    idle: { 
      y: 0, 
      color: error ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)',
      scale: 1
    },
    focus: { 
      y: 0, 
      color: error ? 'rgb(239, 68, 68)' : 'rgb(255, 61, 0)',
      scale: 1.05
    }
  };
  
  // Use simpler version for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div className={`relative mb-4 ${className}`}>
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative flex items-center">
          {icon && (
            <div className={`absolute left-3 ${error ? 'text-red-500' : 'text-gray-500'}`}>
              {icon}
            </div>
          )}
          
          <input
            ref={inputRef}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || label}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full py-2.5 px-4 ${icon ? 'pl-10' : ''} border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-accent-color/20 focus:border-accent-color
            text-gray-800 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            transition-all duration-200`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        
        {error && (
          <div 
            id={`${id}-error`}
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative mb-4 ${className}`}>
      <motion.label 
        htmlFor={id} 
        className="block text-sm font-medium mb-1"
        variants={labelVariants}
        initial="idle"
        animate={isFocused ? "focus" : "idle"}
        transition={{ duration: 0.3 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>
      
      <div className="relative flex items-center">
        {icon && (
          <motion.div 
            className="absolute left-3 text-gray-500"
            variants={iconVariants}
            initial="idle"
            animate={isFocused ? "focus" : "idle"}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        
        <motion.input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || label}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full py-3 px-4 ${icon ? 'pl-10' : ''} border border-gray-200 rounded-lg 
          focus:outline-none text-gray-800 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          variants={borderVariants}
          initial="idle"
          animate={isFocused ? "focus" : "idle"}
          transition={{ duration: 0.3 }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={error ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        {error && (
          <motion.div 
            id={`${id}-error`}
            className="text-sm text-red-500 mt-1"
            role="alert"
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FormInput; 