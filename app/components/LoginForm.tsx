'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../context/AuthContext';
import FormInput from './FormInput';
import Button from './Button';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { login, resetPassword, googleSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch(error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password');
            break;
          case 'auth/too-many-requests':
            setError('Too many attempts. Try again later');
            break;
          default:
            setError('Failed to sign in. Please try again');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await resetPassword(email);
      setResetEmailSent(true);
      setError('');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          setError('No account found with this email');
        } else {
          setError('Failed to send reset email. Try again later');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await googleSignIn();
    } catch (error) {
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Email icon SVG
  const emailIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
  
  // Password icon SVG
  const passwordIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
  
  // Google icon
  const googleIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Glass container */}
      <motion.div 
        className="p-6 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl"
        whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 15px rgba(0, 0, 0, 0.15)' }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={emailIcon}
          />
          
          <FormInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={passwordIcon}
          />
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm px-2 py-2 bg-red-500/10 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.div>
          )}
          
          {resetEmailSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-sm px-2 py-2 bg-green-500/10 rounded-lg border border-green-500/20"
            >
              Password reset email sent. Check your inbox.
            </motion.div>
          )}
          
          <div className="flex justify-end items-center mt-2">
            <motion.div
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/auth/reset-password"
                className="text-sm text-accent-color hover:text-accent-hover transition-colors"
              >
                Forgot Password?
              </Link>
            </motion.div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              variant="gradient"
              isLoading={isLoading}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              }
              iconPosition="right"
              className="shadow-lg"
            >
              Login
            </Button>
          </div>
        </form>
        
        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-gray-600/30"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-600/30"></div>
        </div>
        
        <div className="flex justify-center">
          <motion.div
            className="w-full max-w-xs mx-auto"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            <Button
              onClick={handleGoogleSignIn}
              variant="glass"
              fullWidth
              disabled={isLoading}
              icon={googleIcon}
              className="group"
            >
              <span className="relative">
                Sign in with Google
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm; 