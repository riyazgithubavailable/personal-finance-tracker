// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpIsrksbvi9t-7leb1MTcef-t0bEbPWI0",
  authDomain: "financely-project.firebaseapp.com",
  projectId: "financely-project",
  storageBucket: "financely-project.appspot.com",
  messagingSenderId: "709480280996",
  appId: "1:709480280996:web:1f56a6fc4c3a9549280731",
  measurementId: "G-G69C8BJPH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };