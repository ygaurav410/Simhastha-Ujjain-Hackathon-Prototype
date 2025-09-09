// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAMbndKUEHtnb_OOVENu-ivyzHBJ9DnC-0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "simhastha-fa643.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "simhastha-fa643",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "simhastha-fa643.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1082909810453",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1082909810453:web:ef91de18308d318d7c131c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZMF55ME3QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize other Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };