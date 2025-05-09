'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

// Component to handle search params
function AuthContent() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { usingMockAuth } = useAuth();
  const searchParams = useSearchParams();
  
  // Set initial tab based on URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const tabVariants = {
    inactive: { opacity: 0.6, y: 0 },
    active: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    enter: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.5 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Background bubbles animation for left side
  const bubbles = Array.from({ length: 8 }).map((_, i) => ({
    size: Math.random() * 120 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-900">
      {/* Left Side - Brand/Visual */}
      <motion.div 
        className="relative hidden md:flex md:w-1/2 bg-black overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Animated background bubbles */}
        {bubbles.map((bubble, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-gradient-to-br from-accent-color/30 to-orange-700/10 backdrop-blur-xl"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
        <div className="z-20 relative flex flex-col justify-center items-center w-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block cursor-pointer"
            >
              <Link href="/" className="block">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 font-[Acorn]">
                  <span className="text-gradient">Élan</span> <span className="text-white">AI</span>
                </h1>
                <p className="text-xl md:text-2xl opacity-90 font-light">Redefine your fashion experience</p>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-md relative z-10"
          >
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="bg-accent-color/20 backdrop-blur-xl rounded-full p-3 mr-5 border border-white/10 shadow-glow">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90 text-lg">Personalized fashion recommendations</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="bg-accent-color/20 backdrop-blur-xl rounded-full p-3 mr-5 border border-white/10 shadow-glow">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90 text-lg">AI-powered style suggestions</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="bg-accent-color/20 backdrop-blur-xl rounded-full p-3 mr-5 border border-white/10 shadow-glow">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90 text-lg">Premium curated collections</p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 z-5 opacity-30 bg-noise" />
      </motion.div>
      
      {/* Right Side - Auth Forms */}
      <div className="flex flex-col w-full md:w-1/2 p-6 md:p-12 justify-center items-center bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {usingMockAuth && (
            <motion.div 
              className="bg-blue-500/10 backdrop-blur-md rounded-xl p-4 mb-8 border border-blue-500/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-400">
                    <strong>Mock Authentication Mode:</strong> Running with simulated authentication.
                  </p>
                  <p className="mt-1 text-sm text-blue-300">
                    You can use any email/password to log in or register.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </motion.h2>
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === 'login' 
                ? 'Sign in to access your account' 
                : 'Join Élan AI to discover your perfect style'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <Link 
                href="/" 
                className="text-accent-color hover:text-accent-hover text-sm transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Home
              </Link>
            </motion.div>
          </div>
          
          {/* Tabs */}
          <motion.div 
            className="flex mb-10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg p-1 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              variants={tabVariants}
              animate={activeTab === 'login' ? 'active' : 'inactive'}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 font-medium text-center rounded-lg transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-accent-color text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </motion.button>
            
            <motion.button
              variants={tabVariants}
              animate={activeTab === 'register' ? 'active' : 'inactive'}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 font-medium text-center rounded-lg transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-accent-color text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </motion.button>
          </motion.div>
          
          {/* Form Container */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial="enter"
                  animate="active"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial="enter"
                  animate="active"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
      {/* Add global styles for noise texture */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 61, 0, 0.3);
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

const AuthPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
};

export default AuthPage; 