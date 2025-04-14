// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC2LLbTKFjVhH2mQjtBvTuQl6uatUj2_Yc",
  authDomain: "biterate-30ede.firebaseapp.com",
  projectId: "biterate-30ede",
  storageBucket: "biterate-30ede.appspot.com",
  messagingSenderId: "487322989444",
  appId: "1:487322989444:web:a2a593e99851bb6af363d1",
  measurementId: "G-7CCQPFB5C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();