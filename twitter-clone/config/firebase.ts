// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const api_key = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const auth_domain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const project_id = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storage_bucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messaging_sender_id = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const app_id = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
const measurement_id = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;
const firebaseConfig = {
  apiKey: api_key,
  authDomain: auth_domain,
  projectId: project_id,
  storageBucket: storage_bucket,
  messagingSenderId: messaging_sender_id,
  appId: app_id,
  measurementId: measurement_id
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);