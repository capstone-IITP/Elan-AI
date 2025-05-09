'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Link from 'next/link';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      await resetPassword(email);
      setSuccess(true);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reset your password</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Password reset email sent! Check your inbox.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
            
            <div className="text-center mt-4">
              <Link 
                href="/auth" 
                className="text-accent-color hover:text-accent-hover text-sm"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default PasswordResetPage; 