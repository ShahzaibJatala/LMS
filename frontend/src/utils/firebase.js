

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "lmsproject-a88d5.firebaseapp.com",
  projectId: "lmsproject-a88d5",
  storageBucket: "lmsproject-a88d5.firebasestorage.app",
  messagingSenderId: "62629991758",
  appId: "1:62629991758:web:44565e0c77ca1d09daba1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider

export {auth,provider}
