'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, usingMockMode } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Simple mock user for development
const mockUser = {
  uid: 'mock-user-123',
  email: 'mock@example.com',
  displayName: 'Mock User',
  emailVerified: true
};

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  usingMockAuth: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize user state from localStorage (if available)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // Handle mock mode for development
        if (usingMockMode) {
          // Check if we have stored mock auth in localStorage
          const storedUser = localStorage.getItem('auth-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser) as unknown as User);
            // Set a mock cookie for middleware
            Cookies.set('auth-session', 'mock-session-token', { expires: 7 });
          }
          setLoading(false);
          return;
        }

        // Only run the auth listener if auth is initialized
        if (!auth) {
          setLoading(false);
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          
          // Persist the auth state
          if (currentUser) {
            // Store user in localStorage for persistence
            localStorage.setItem('auth-user', JSON.stringify(currentUser));
            
            // Set a cookie for middleware authentication
            currentUser.getIdToken().then(token => {
              Cookies.set('auth-session', token, { expires: 7 });
            });
          } else {
            // Clear auth data when logged out
            localStorage.removeItem('auth-user');
            Cookies.remove('auth-session');
          }
          
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };

    // Check localStorage first for faster initial load
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth-user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as unknown as User);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('auth-user');
        }
      }
    }
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (usingMockMode) {
        // Simulate login delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set mock user and store in localStorage
        setUser(mockUser as unknown as User);
        localStorage.setItem('auth-user', JSON.stringify(mockUser));
        Cookies.set('auth-session', 'mock-session-token', { expires: 7 });
        
        router.push('/dashboard');
        return;
      }

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Firebase auth listener will handle storage updates
      router.push('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      if (usingMockMode) {
        // Simulate registration delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set mock user and store in localStorage
        setUser(mockUser as unknown as User);
        localStorage.setItem('auth-user', JSON.stringify(mockUser));
        Cookies.set('auth-session', 'mock-session-token', { expires: 7 });
        
        router.push('/dashboard');
        return;
      }

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      await createUserWithEmailAndPassword(auth, email, password);
      // Firebase auth listener will handle storage updates
      router.push('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (usingMockMode) {
        // Simulate logout delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Clear mock auth data
        setUser(null);
        localStorage.removeItem('auth-user');
        Cookies.remove('auth-session');
        
        router.push('/');
        return;
      }

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      await signOut(auth);
      // Firebase auth listener will handle storage updates
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (usingMockMode) {
        // Simulate password reset delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Mock password reset email sent to', email);
        return;
      }

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      if (usingMockMode) {
        // Simulate Google sign in delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const googleMockUser = {
          ...mockUser,
          displayName: 'Google Mock User',
        };
        
        // Set mock user and store in localStorage
        setUser(googleMockUser as unknown as User);
        localStorage.setItem('auth-user', JSON.stringify(googleMockUser));
        Cookies.set('auth-session', 'mock-session-token', { expires: 7 });
        
        router.push('/dashboard');
        return;
      }

      if (!auth) {
        throw new Error("Firebase authentication is not initialized");
      }
      
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Firebase auth listener will handle storage updates
      router.push('/dashboard');
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      resetPassword, 
      googleSignIn,
      usingMockAuth: usingMockMode 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 