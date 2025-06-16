// Import needed functions from needed SDKs
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXEB2oZz8OfuYE7LaNpK6i2d0o3WtehA0",
  authDomain: "anxiriley-cf0bf.firebaseapp.com",
  databaseURL: "https://anxiriley-cf0bf-default-rtdb.firebaseio.com",
  projectId: "anxiriley-cf0bf",
  storageBucket: "anxiriley-cf0bf.firebasestorage.app",
  messagingSenderId: "762933477632",
  appId: "1:762933477632:web:c87475d7531eaf818573e5",
  measurementId: "G-ETSWT6VVL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export for other scripts
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };