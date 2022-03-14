// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-_jGz1sZ7FqfdYdWNitOK_5ntTCFP-pQ",
  authDomain: "auth-development-c495b.firebaseapp.com",
  projectId: "auth-development-c495b",
  storageBucket: "auth-development-c495b.appspot.com",
  messagingSenderId: "378131714366",
  appId: "1:378131714366:web:02f4cd38581a3490249c6f",
  measurementId: "G-8R5M82CZD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore()

export { auth, db }