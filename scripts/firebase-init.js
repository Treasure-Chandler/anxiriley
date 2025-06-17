// Import needed functions from needed SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
export { auth };