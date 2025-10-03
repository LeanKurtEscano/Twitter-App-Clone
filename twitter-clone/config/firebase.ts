// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEm59qPLmPoJl4Q3mJn8bRSJUIbycl3QQ",
  authDomain: "twitter-clone-fa852.firebaseapp.com",
  projectId: "twitter-clone-fa852",
  storageBucket: "twitter-clone-fa852.firebasestorage.app",
  messagingSenderId: "349071256023",
  appId: "1:349071256023:web:69505bc54df36507f08392",
  measurementId: "G-T7WNHG25YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);