// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAR2mw6erM0zEJp6xEGRn6Q_KrTriEYix4",
  authDomain: "goldloan-dbe36.firebaseapp.com",
  projectId: "goldloan-dbe36",
  storageBucket: "goldloan-dbe36.appspot.com",
  messagingSenderId: "242296268770",
  appId: "1:242296268770:web:49b0a56cc9697bdf6a7bbb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getDatabase(app)
export const firestoredb = getFirestore()
export const provider = new GoogleAuthProvider()
