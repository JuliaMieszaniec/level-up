// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD6UqzL884_To6gWabLYU4cvjwQiDIL350",
    authDomain: "levelup-71b50.firebaseapp.com",
    projectId: "levelup-71b50",
    storageBucket: "levelup-71b50.firebasestorage.app",
    messagingSenderId: "890322883750",
    appId: "1:890322883750:web:14f3a6cb7f89d7b900d067",
    measurementId: "G-ZC4S7CWBPQ"
  };

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, db };
