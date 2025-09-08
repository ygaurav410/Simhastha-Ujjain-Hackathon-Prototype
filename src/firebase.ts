// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMbndKUEHtnb_OOVENu-ivyzHBJ9DnC-0",
  authDomain: "simhastha-fa643.firebaseapp.com",
  projectId: "simhastha-fa643",
  storageBucket: "simhastha-fa643.firebasestorage.app",
  messagingSenderId: "1082909810453",
  appId: "1:1082909810453:web:ef91de18308d318d7c131c",
  measurementId: "G-ZMF55ME3QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
