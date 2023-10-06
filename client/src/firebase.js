// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "estatem-774fd.firebaseapp.com",
  projectId: "estatem-774fd",
  storageBucket: "estatem-774fd.appspot.com",
  messagingSenderId: "164374907866",
  appId: "1:164374907866:web:8fa0c601c68683afedcee3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
