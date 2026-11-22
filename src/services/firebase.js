import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCCbDbHeT09ytzrbbFhSTJUvEJKZY4Uyo8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "iqra-shoes.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "iqra-shoes",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "iqra-shoes.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "221188017381",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:221188017381:web:a879cf6fa1942e1417d80c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SNM2NHF63W"
};

// Initialize Firebase App instance safely (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Ensure persistence
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Auth persistence configuration notice:', err.message);
  });
}

// Firestore Database
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

export default app;
