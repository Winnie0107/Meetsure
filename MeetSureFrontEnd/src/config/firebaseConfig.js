// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOo1wJqnmsRAIng1AdOzB0-RRSEtxlAOg",
  authDomain: "meetsure-new.firebaseapp.com",
  projectId: "meetsure-new",
  storageBucket: "meetsure-new.appspot.com",
  messagingSenderId: "19160895714",
  appId: "1:19160895714:web:f887f1324f6b139dfc8ebb",
  measurementId: "G-RYES5MB9P7"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
