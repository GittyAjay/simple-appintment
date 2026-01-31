// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyzpcLY1riHrDzbwz1On31B-1UrkQmCsA",
  authDomain: "quiquiz-40550.firebaseapp.com",
  projectId: "quiquiz-40550",
  storageBucket: "quiquiz-40550.firebasestorage.app",
  messagingSenderId: "982326143123",
  appId: "1:982326143123:web:ae4e8907b7d417fb1b4566"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
