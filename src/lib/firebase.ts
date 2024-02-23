// Import the functions you need from the SDKs you need
import { env } from '@/env';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_KEY,
    authDomain: `${env.NEXT_PUBLIC_FIREBASE_PROJECT}.firebaseapp.com`,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT,
    storageBucket: `${env.NEXT_PUBLIC_FIREBASE_PROJECT}.appspot.com`,
    messagingSenderId: "829558898487",
    appId: env.NEXT_PUBLIC_FIREBASE_ID,
    measurementId: "G-4KJVEV2XVD"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
