/**
 * @author Treasure Chandler
 * 
 * Handles Firebase authentication/Firestore data handling in this file, for simplicity.
 */

export const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
