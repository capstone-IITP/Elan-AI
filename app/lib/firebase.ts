// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Development flag
const isDevelopment = process.env.NODE_ENV === 'development';
const usingMockMode = isDevelopment && (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                     process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-key-for-development");

// Check if we're using fallback values in development
if (usingMockMode) {
  console.warn(
    "Firebase credentials not found. Running in mock authentication mode.\n" +
    "For full functionality, add Firebase config to your .env.local file.\n" +
    "Check README.md for setup instructions."
  );
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA_hKRlfY4K4jvW_lJotOWz3lI44bTeJd0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "elan-ai-01.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "elan-ai-01",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "elan-ai-01.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "453494108128",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:453494108128:web:ac7b87486ecaa1b435c585",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NL065TVNSN"
};

// Initialize Firebase only on the client side
let firebaseApp;
let auth: Auth;
let analytics;

// Create a simple mock auth object for development
const mockAuth = {} as Auth;

if (typeof window !== "undefined") {
  try {
    if (!usingMockMode) {
      firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(firebaseApp);
      // Initialize Analytics (only in browser environment)
      analytics = getAnalytics(firebaseApp);
    } else {
      // Use mock auth in development when Firebase is not configured
      console.log("Using mock authentication for development");
      auth = mockAuth;
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    if (isDevelopment) {
      console.log("Falling back to mock authentication");
      auth = mockAuth;
    }
  }
}

export { auth, analytics, usingMockMode }; 