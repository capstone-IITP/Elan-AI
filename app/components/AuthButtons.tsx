'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const AuthButtons = () => {
  const { user, logout } = useAuth();
  
  // Animation variants
  const buttonVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };
  
  // Staggered animation for buttons
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  return (
    <motion.div 
      className="flex items-center space-x-3"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {user ? (
        <>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href="/dashboard" className="block">
              <Button 
                variant="outline" 
                className="border-2 border-accent-color hover:bg-accent-color/10 transition-all duration-300"
              >
                Dashboard
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              variant="secondary" 
              onClick={logout}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
            >
              Sign Out
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href="/auth" className="block">
              <Button 
                variant="outline" 
                className="border-2 border-accent-color hover:bg-accent-color/10 text-accent-color transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-color via-accent-hover to-accent-color rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-gradient"></div>
            <Link href="/auth?tab=register" className="block relative">
              <Button 
                className="bg-gradient-to-r from-accent-color to-accent-hover hover:from-accent-hover hover:to-accent-color transition-all duration-500 text-white font-medium"
              >
                Sign Up
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AuthButtons; 