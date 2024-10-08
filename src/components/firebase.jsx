// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyA-hG7_MHASJycyBc8g7KZe_mXTBChSsSQ",
  authDomain: "vervein-7d21a.firebaseapp.com",
  projectId: "vervein-7d21a",
  storageBucket: "vervein-7d21a.appspot.com",
  messagingSenderId: "427997870959",
  appId: "1:427997870959:web:1732fb68fbafd6a9a6069a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, googleProvider, githubProvider, storage }; // Export all necessary components
