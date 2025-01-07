import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbbssPKr0RqrJa4PGpSA0YtyAC421oPfc",
  authDomain: "journeyconnect-c8f47.firebaseapp.com",
  projectId: "journeyconnect-c8f47",
  storageBucket: "journeyconnect-c8f47.firebasestorage.app",
  messagingSenderId: "196716720963",
  appId: "1:196716720963:web:21781ee0c4db1a489fb5f6",
  measurementId: "G-3DCQR6GXZZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { app, db }; // Export both app and db