

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginlms-3e0a1.firebaseapp.com",
  projectId: "loginlms-3e0a1",
  storageBucket: "loginlms-3e0a1.firebasestorage.app",
  messagingSenderId: "54043223280",
  appId: "1:54043223280:web:cf37094422fcc4571dce35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider

export {auth,provider}