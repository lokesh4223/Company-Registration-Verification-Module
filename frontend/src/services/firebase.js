import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://company-registration-default.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if we have the required config
let app;
let auth;
let analytics;

console.log('Firebase config:', firebaseConfig);

try {
  // Check if we have the required config values
  const hasRequiredConfig = firebaseConfig.apiKey && 
                           firebaseConfig.authDomain && 
                           firebaseConfig.projectId && 
                           firebaseConfig.storageBucket && 
                           firebaseConfig.messagingSenderId && 
                           firebaseConfig.appId;
  
  if (hasRequiredConfig) {
    console.log('Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Enable logging for debugging
    console.log('Firebase Auth initialized:', !!auth);
    
    // Initialize Analytics only in browser environment
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn('Analytics initialization failed:', analyticsError);
      }
    }
    
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase config incomplete - some features may not work');
    console.log('Missing config values:', {
      apiKey: !!firebaseConfig.apiKey,
      authDomain: !!firebaseConfig.authDomain,
      projectId: !!firebaseConfig.projectId,
      storageBucket: !!firebaseConfig.storageBucket,
      messagingSenderId: !!firebaseConfig.messagingSenderId,
      appId: !!firebaseConfig.appId
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.error('Firebase config at time of error:', firebaseConfig);
}

// Export services
export { app, auth, analytics, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged };