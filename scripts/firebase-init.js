// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCssALozqYnM3bknK7hPxLWUZtTtz6bLeY",
  authDomain: "anxiriley-cf0bf.firebaseapp.com",
  databaseURL: "https://anxiriley-cf0bf-default-rtdb.firebaseio.com",
  projectId: "anxiriley-cf0bf",
  storageBucket: "anxiriley-cf0bf.firebasestorage.app",
  messagingSenderId: "762933477632",
  appId: "1:762933477632:web:eeb61395c3d111d58573e5",
  measurementId: "G-K0YCLZ26NV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set global auth
window.auth = firebase.auth();