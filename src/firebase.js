// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDb31nV_xSMf2-D4thUeA2XXfLUOpMxCIw",
  authDomain: "biterate.firebaseapp.com",
  projectId: "biterate",
  storageBucket: "biterate.firebasestorage.app",
  messagingSenderId: "713726670744",
  appId: "1:713726670744:web:9d08d2fd64a83afb7edded",
  measurementId: "G-25QSMCK2NY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');