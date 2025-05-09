'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';
import { prefersReducedMotion } from '../lib/animations';

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'gradient';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = ({
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  children,
  className = '',
  icon,
  iconPosition = 'left',
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseClasses = 
    'relative py-3 px-6 font-medium transition-all duration-300 flex justify-center items-center optimize-gpu rounded-xl overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-color to-accent-hover text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600',
    outline: 'bg-transparent border-2 border-accent-color text-accent-color hover:bg-accent-color/10',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15',
    gradient: 'text-white'
  };
  
  // Animation variants
  const rippleVariants = {
    initial: {
      scale: 0,
      opacity: 0.5,
    },
    clicked: {
      scale: 1.5,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || !onClick) return;
    
    // Call the onClick handler
    onClick();
  };

  // If reduced motion is preferred, use a simpler button
  if (prefersReducedMotion) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          ${baseClasses}
          ${variant === 'primary' && !className.includes('bg-') ? variantClasses[variant] : ''}
          ${variant === 'secondary' && !className.includes('bg-') ? variantClasses[variant] : ''}
          ${variant === 'outline' && !className.includes('border-') ? variantClasses[variant] : ''}
          ${variant === 'glass' && !className.includes('bg-') ? variantClasses[variant] : ''}
          ${variant === 'gradient' && !className.includes('bg-') ? variantClasses[variant] : ''}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 z-10">
            <Spinner size="sm" color="text-current" />
            <span>Loading...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 z-10 relative">
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </span>
        )}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileHover={disabled ? {} : { 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        ${baseClasses}
        ${variant === 'primary' && !className.includes('bg-') ? variantClasses[variant] : ''}
        ${variant === 'secondary' && !className.includes('bg-') ? variantClasses[variant] : ''}
        ${variant === 'outline' && !className.includes('border-') ? variantClasses[variant] : ''}
        ${variant === 'glass' && !className.includes('bg-') ? variantClasses[variant] : ''}
        ${variant === 'gradient' && !className.includes('bg-') ? variantClasses[variant] : ''}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'ripple-effect'}
        ${className}
      `}
      style={{
        boxShadow: variant === 'primary' && !disabled ? '0 10px 15px -3px rgba(255, 61, 0, 0.3), 0 4px 6px -4px rgba(255, 61, 0, 0.2)' : undefined,
        background: variant === 'gradient' && !disabled ? 'linear-gradient(90deg, #ff3d00, #ff6e40, #ff9e80)' : undefined,
        backgroundSize: variant === 'gradient' && !disabled ? '200% 100%' : undefined,
        backgroundPosition: isHovered ? 'right center' : 'left center',
        transition: 'background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Subtle hover glow effect */}
      {variant === 'primary' && !disabled && (
        <motion.div 
          className="absolute inset-0 bg-white opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Gradient hover effect with animated position */}
      {variant === 'gradient' && !disabled && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          animate={{ 
            backgroundPosition: isHovered ? '100% 0%' : '0% 0%',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(90deg, #ff3d00, #ff6e40, #ff9e80)',
            backgroundSize: '200% 100%',
          }}
        />
      )}
      
      {/* 3D lift effect for outline variant */}
      {variant === 'outline' && !disabled && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-accent-color/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {isLoading ? (
        <span className="flex items-center gap-2 z-10">
          <Spinner size="sm" color="text-current" />
          <span>Loading...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 z-10 relative">
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </span>
      )}
    </motion.button>
  );
};

export default Button; 